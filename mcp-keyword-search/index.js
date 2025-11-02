#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import fs from "fs/promises";
import path from "path";

// Create MCP server instance
const server = new Server(
  {
    name: "keyword-search-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Define the keyword search tool
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "search_keyword_in_file",
        description: "Searches for a specified keyword within a file and returns all matching lines with line numbers",
        inputSchema: {
          type: "object",
          properties: {
            file_path: {
              type: "string",
              description: "The path to the file to search in",
            },
            keyword: {
              type: "string",
              description: "The keyword to search for",
            },
            case_sensitive: {
              type: "boolean",
              description: "Whether the search should be case-sensitive (default: false)",
              default: false,
            },
          },
          required: ["file_path", "keyword"],
        },
      },
    ],
  };
});

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "search_keyword_in_file") {
    const { file_path, keyword, case_sensitive = false } = request.params.arguments;

    try {
      // Validate inputs
      if (!file_path || !keyword) {
        throw new Error("file_path and keyword are required");
      }

      // Read the file
      const fileContent = await fs.readFile(file_path, "utf-8");
      const lines = fileContent.split("\n");

      // Search for keyword
      const searchKeyword = case_sensitive ? keyword : keyword.toLowerCase();
      const matches = [];

      lines.forEach((line, index) => {
        const searchLine = case_sensitive ? line : line.toLowerCase();
        if (searchLine.includes(searchKeyword)) {
          matches.push({
            line_number: index + 1,
            content: line.trim(),
          });
        }
      });

      // Format results
      const result = {
        file_path,
        keyword,
        case_sensitive,
        total_matches: matches.length,
        matches: matches,
      };

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              error: error.message,
              file_path,
              keyword,
            }),
          },
        ],
        isError: true,
      };
    }
  }

  throw new Error(`Unknown tool: ${request.params.name}`);
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Keyword Search MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});