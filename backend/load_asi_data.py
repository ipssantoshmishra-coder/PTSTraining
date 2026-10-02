import sys
from pathlib import Path
import pandas as pd
from sqlalchemy import text

# Import the engine directly from your actual core/database module
from app.core.database import engine

CSV_FILE = "ASI Accountant Details2.csv"
TEST_ROLL_NUMBER = "3870223"  # Preserves your test login account

def load_data():
    csv_path = Path(__file__).resolve().parent.parent / CSV_FILE
    if not csv_path.exists():
        csv_path = Path(CSV_FILE)

    print(f"Reading CSV from: {csv_path}")
    # Skip line 0 ('ASI Accountant Details') so headers start on line 1
    df = pd.read_csv(csv_path, skiprows=1)

    # 1. Convert M/D/YYYY -> DD/MM/YYYY
    df['dob'] = pd.to_datetime(df['dob'], format='%m/%d/%Y').dt.strftime('%d/%m/%Y')

    # 2. Clean types
    df['roll_number'] = df['roll_number'].astype(str).str.strip()
    df['phone_number'] = df['phone_number'].astype(str).str.strip()
    df = df.fillna('')

    cols = [
        'roll_number', 'dob', 'full_name', 'phone_number', 'home_district',
        'hostel_name', 'barrack_no', 'bed_no', 'barrack_incharge_name',
        'barrack_incharge_phone', 'mess_name', 'mess_incharge_name',
        'mess_incharge_phone', 'indoor_batch_no', 'indoor_room_no',
        'indoor_incharge_name', 'indoor_incharge_phone', 'outdoor_company',
        'outdoor_platoon', 'outdoor_incharge_name', 'outdoor_incharge_phone'
    ]
    df_clean = df[cols]

    with engine.begin() as conn:
        print(f"Cleaning existing records (preserving roll {TEST_ROLL_NUMBER})...")
        conn.execute(
            text("DELETE FROM recruits WHERE roll_number != :test_roll"),
            {"test_roll": TEST_ROLL_NUMBER}
        )

        print(f"Pushing {len(df_clean)} records to Supabase...")
        df_clean.to_sql('recruits', conn, if_exists='append', index=False)

    print("Data successfully loaded!")

if __name__ == "__main__":
    load_data()