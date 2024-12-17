from fastapi import FastAPI, Request
import uvicorn

app = FastAPI()


@app.post("/parrot/notify")
async def receive_notification(request: Request):
    data = await request.json()
    print("\nReceived notification:")
    print(f"Event: {data.get('event')}")
    print(f"Branch: {data.get('ref')}")
    print(f"Repository: {data.get('repository')}")

    # Print commit info if it exists
    commit = data.get('commit', {})
    if commit:
        print("\nCommit details:")
        print(f"Message: {commit.get('message')}")
        print(f"Author: {commit.get('author')}")
        print(f"URL: {commit.get('url')}")

    return {"status": "ok"}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=9229)
