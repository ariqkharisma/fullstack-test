import uvicorn
import dotenv
import os

dotenv.load_dotenv(".env")

if __name__ == "__main__":
  uvicorn.run("app.main:app", host=os.getenv('PRODUCTION_HOST'), port=int(os.getenv('PRODUCTION_PORT')), reload=True)