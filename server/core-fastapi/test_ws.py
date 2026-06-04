import asyncio
import websockets
import json

async def test_websocket_stream():
    uri = "ws://localhost:8000/ws/v1/sandbox/US"
    print(f"📡 Connecting to PyTorch Sandbox Engine at {uri}...")
    
    try:
        async with websockets.connect(uri) as websocket:
            print("✅ Connected! Waiting for simulation stream...\n")
            
            for _ in range(10): # Expecting 10 epochs
                message = await websocket.recv()
                data = json.loads(message)
                
                epoch = data.get("epoch")
                status = data.get("status_message")
                population = data.get("population", {}).get("total_population", 0)
                
                print(f"[{epoch}/10] {status} | Pop: {population:,.0f}")
                
            print("\n🏁 Simulation Stream Complete.")
            
    except ConnectionRefusedError:
        print("❌ Connection refused. Ensure the FastAPI server is running on port 8000 (npm run start:all).")
    except Exception as e:
        print(f"⚠️ Error: {e}")

if __name__ == "__main__":
    asyncio.run(test_websocket_stream())
