# MCP Keyword Search Server

A Model Context Protocol (MCP) server that provides keyword search functionality within files.

## Features

- Search for keywords in text files
- Case-sensitive and case-insensitive search options
- Returns line numbers and matching content
- Compatible with MCP Inspector for testing

## Installation

```bash
npm install
```

## Usage

### With MCP Inspector

1. Install MCP Inspector:
```bash
npx @modelcontextprotocol/inspector node index.js
```

2. Open the provided URL in your browser
3. Test the `search_keyword_in_file` tool with sample inputs

### Example Input

```json
{
  "file_path": "./sample.txt",
  "keyword": "search",
  "case_sensitive": false
}
```

### Example Output

```json
{
  "file_path": "./sample.txt",
  "keyword": "search",
  "case_sensitive": false,
  "total_matches": 2,
  "matches": [
    {
      "line_number": 1,
      "content": "This is a sample file for search testing."
    },
    {
      "line_number": 5,
      "content": "Another line with the search keyword."
    }
  ]
}
```

## Tool Details

### `search_keyword_in_file`

Searches for a specified keyword within a file.

**Parameters:**
- `file_path` (string, required): Path to the file to search
- `keyword` (string, required): Keyword to search for
- `case_sensitive` (boolean, optional): Whether search should be case-sensitive (default: false)

**Returns:**
- JSON object containing:
  - `file_path`: The searched file path
  - `keyword`: The searched keyword
  - `case_sensitive`: Whether search was case-sensitive
  - `total_matches`: Number of matches found
  - `matches`: Array of objects with `line_number` and `content`

## Testing

Create a sample file for testing:

```bash
echo "This is a sample file for search testing.\nHere is some text.\nMore content here.\nTesting keywords.\nAnother line with the search keyword." > sample.txt
```

Then run the MCP Inspector as shown above.

## Requirements

- Node.js 18 or higher
- npm or yarn

## License

ISC