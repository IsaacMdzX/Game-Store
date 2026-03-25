from datetime import datetime, timezone, timedelta
from zoneinfo import ZoneInfo

MX_TIMEZONE = ZoneInfo('America/Mexico_City')


def utc_now_naive():
    return datetime.now(timezone.utc).replace(tzinfo=None)


def to_mx_datetime(value):
    if value is None:
        return None

    if value.tzinfo is None:
        value = value.replace(tzinfo=timezone.utc)

    return value.astimezone(MX_TIMEZONE)


def format_datetime_mx(value, fmt='%Y-%m-%d %H:%M', fallback=''):
    localized = to_mx_datetime(value)
    if localized is None:
        return fallback
    return localized.strftime(fmt)


def isoformat_datetime_mx(value):
    localized = to_mx_datetime(value)
    if localized is None:
        return None
    return localized.isoformat()


def parse_mx_date_start_to_utc_naive(date_string):
    if not date_string:
        return None

    local_start = datetime.strptime(date_string, '%Y-%m-%d').replace(tzinfo=MX_TIMEZONE)
    return local_start.astimezone(timezone.utc).replace(tzinfo=None)


def parse_mx_date_end_exclusive_to_utc_naive(date_string):
    if not date_string:
        return None

    local_start = datetime.strptime(date_string, '%Y-%m-%d').replace(tzinfo=MX_TIMEZONE)
    local_end_exclusive = local_start + timedelta(days=1)
    return local_end_exclusive.astimezone(timezone.utc).replace(tzinfo=None)


def today_mx():
    return datetime.now(MX_TIMEZONE).date()
