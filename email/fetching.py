import imaplib
import email
from email.header import decode_header
import datetime
from bs4 import BeautifulSoup   # type: ignore

# ====== Configuration ======
IMAP_HOST = 'imap.gmail.com'
EMAIL_USER = 'lulu0511siwenshao@gmail.com'
EMAIL_PASS = 'knkvcfmnchaxmypp'  # NOT your normal Gmail password if 2FA is enabled

# ====== Core Functions ======

def clean(text):
    # Clean text for creating folder/file names
    return "".join(c if c.isalnum() else "_" for c in text)

def get_date_range(days=7):
    # Get IMAP-compatible date string N days ago
    date = (datetime.date.today() - datetime.timedelta(days=days))
    return date.strftime("%d-%b-%Y")

def get_receipts():
    # Connect to Gmail
    mail = imaplib.IMAP4_SSL(IMAP_HOST)
    mail.login(EMAIL_USER, EMAIL_PASS)
    mail.select("inbox")

    # Search for emails from the past N days with 'receipt' in subject
    since_date = get_date_range(days=7)
    query = f'(SINCE {since_date} SUBJECT "receipt")'
    status, messages = mail.search(None, query)

    if status != 'OK':
        print("No messages found!")
        return

    email_ids = messages[0].split()
    print(f"Found {len(email_ids)} receipt emails from the past week.\n")

    for email_id in email_ids:
        res, msg = mail.fetch(email_id, "(RFC822)")
        for response in msg:
            if isinstance(response, tuple):
                msg = email.message_from_bytes(response[1])

                # Decode subject
                subject, encoding = decode_header(msg["Subject"])[0]
                if isinstance(subject, bytes):
                    subject = subject.decode(encoding if encoding else "utf-8")
                subject = clean(subject)

                from_ = msg.get("From")
                date_ = msg.get("Date")

                print(f"📩 Subject: {subject}")
                print(f"   From: {from_}")
                print(f"   Date: {date_}")

                # Fetch the email body

                # Inside your msg.walk() loop:
                if msg.is_multipart():
                    for part in msg.walk():
                        content_type = part.get_content_type()
                        content_disposition = str(part.get("Content-Disposition"))

                        if "attachment" in content_disposition:
                            filename = part.get_filename()
                            if filename:
                                filename = decode_header(filename)[0][0]
                                if isinstance(filename, bytes):
                                    filename = filename.decode()
                                print(f"   📎 Found attachment: {filename}")

                        elif content_type == "text/plain":
                            body = part.get_payload(decode=True).decode()
                            print(f"   📜 Text body snippet: {body[:200]}...\n")

                        elif content_type == "text/html":
                            html = part.get_payload(decode=True).decode()
                            soup = BeautifulSoup(html, "html.parser")
                            text = soup.get_text()
                            print(f"   🌐 HTML body (text extracted) snippet: {text[:200]}...\n")

                else:
                    body = msg.get_payload(decode=True).decode()
                    print(f"   📜 Text body snippet: {body[:200]}...\n")


    mail.logout()

# ====== Run This ======
if __name__ == "__main__":
    get_receipts()
