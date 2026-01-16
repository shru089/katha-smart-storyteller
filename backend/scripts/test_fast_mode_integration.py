import requests
import sys

def test_fast_mode():
    try:
        # Step 1: Get a valid scene ID
        print("Fetching scenes from Chapter 9...")
        chapter_url = "http://localhost:8000/api/chapters/9/scenes"
        r = requests.get(chapter_url)
        if r.status_code != 200:
            print(f"FAILED to get scenes: {r.status_code}")
            return
            
        scenes = r.json()
        if not scenes:
            print("No scenes found in Chapter 9")
            return
            
        scene_id = scenes[0]['id']
        print(f"Found valid Scene ID: {scene_id}")
        
        # Step 2: Test Generate with Fast Mode
        url = f"http://localhost:8000/api/scenes/{scene_id}/generate"
        params = {"fast_mode": "true"}
        
        print(f"Testing POST {url} with params {params}")
        
        response = requests.post(url, params=params)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print("Response JSON:")
            print(data)
            
            video_url = data.get("ai_video_url")
            print(f"Video URL: {video_url}")
            
            if video_url and "fast" in video_url:
                print("SUCCESS: Fast mode tag found in URL!")
            else:
                print("WARNING: Video generated but 'fast' not clearly visible in URL")
                
        else:
            print("REQUEST FAILED!")
            print(response.text)
            
    except Exception as e:
        print(f"EXCEPTION: {e}")

if __name__ == "__main__":
    test_fast_mode()
