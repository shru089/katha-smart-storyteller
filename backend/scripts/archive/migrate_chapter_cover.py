"""
Manual Database Migration: Add cover_image_url to Chapter table
SQLite doesn't support ALTER TABLE ADD COLUMN well, so we use a workaround
"""

import sys
sys.path.insert(0, '.')

import sqlite3
from pathlib import Path

DB_PATH = "katha.db"

def add_column_to_chapter():
    """Add cover_image_url column to chapter table"""
    
    print("\n" + "="*80)
    print("🔧 DATABASE MIGRATION: Adding cover_image_url to Chapter")
    print("="*80 + "\n")
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    try:
        # Check if column already exists
        cursor.execute("PRAGMA table_info(chapter)")
        columns = [column[1] for column in cursor.fetchall()]
        
        if 'cover_image_url' in columns:
            print("✅ Column 'cover_image_url' already exists in chapter table")
        else:
            # Add the column
            cursor.execute("ALTER TABLE chapter ADD COLUMN cover_image_url TEXT")
            conn.commit()
            print("✅ Successfully added 'cover_image_url' column to chapter table")
        
        print("\n" + "="*80 + "\n")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    add_column_to_chapter()
