from datetime import datetime, timedelta

def is_yesterday(date_obj):
    if not date_obj:
        return False
    return (datetime.utcnow().date() - date_obj) == timedelta(days=1)

def is_today(date_obj):
    if not date_obj:
        return False
    return date_obj == datetime.utcnow().date()
