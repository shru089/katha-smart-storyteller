import sys
try:
    import audioop_lts
    print("audioop_lts imported")
    sys.modules["audioop"] = audioop_lts
except ImportError:
    print("audioop_lts not found")

try:
    import pydub
    print("pydub imported successfully")
except ImportError as e:
    print(f"pydub import failed: {e}")
