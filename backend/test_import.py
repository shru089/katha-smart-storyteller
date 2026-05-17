try:
    import pydub
    print("pydub imported successfully")
except ImportError as e:
    print(f"pydub import failed: {e}")

try:
    import audioop
    print("audioop imported successfully")
except ImportError as e:
    print(f"audioop import failed: {e}")
