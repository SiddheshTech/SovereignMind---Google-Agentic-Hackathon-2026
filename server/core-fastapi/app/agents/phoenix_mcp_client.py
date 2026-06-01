import os
import asyncio
from typing import Dict, Any, List
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client
from app.core.config import settings

class PhoenixMCPClient:
    def __init__(self):
        self.phoenix_url = settings.PHOENIX_COLLECTOR_ENDPOINT.replace("/v1/traces", "").replace(":4317", ":6006")
        if "http" not in self.phoenix_url:
            self.phoenix_url = "http://localhost:6006"

    async def get_recent_traces(self) -> str:
        """
        Uses the Phoenix MCP server to query recent traces.
        """
        server_params = StdioServerParameters(
            command="npx",
            args=[
                "-y",
                "@arizeai/phoenix-mcp@latest",
            ],
            env={
                **os.environ,
                "PHOENIX_API_KEY": os.getenv("PHOENIX_API_KEY", ""),
                "PHOENIX_HOST": self.phoenix_url
            }
        )

        try:
            async with stdio_client(server_params) as (read, write):
                async with ClientSession(read, write) as session:
                    await session.initialize()
                    # List tools to see what's available (optional, for debug)
                    # tools = await session.list_tools()
                    # print("Available Phoenix MCP Tools:", tools)
                    
                    # Call a tool to get datasets or traces
                    # Since we don't know the exact tool name without introspection, we can fetch projects
                    result = await session.call_tool("get_projects", {})
                    return str(result.content)
        except Exception as e:
            print(f"⚠️ Error calling Phoenix MCP Server: {e}")
            return f"Error: {e}"

phoenix_mcp = PhoenixMCPClient()
