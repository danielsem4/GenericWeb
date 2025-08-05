import boto3
from botocore.exceptions import ClientError


"""
sendSMSMessage: a function for sending SMS (text) messages to a phone recipient.
Parameters: msg: A dictionary containing the following strings:
        {
            'phone': phone number (international string begining with a +),
            'sender': a string identifying the sender,
            'message': message text
        }
Returns: 0=success / 1=failure
"""
def sendSMSMessage(msg):
    n = len(msg)
    for i in range(n):
        phone = msg['phone']
        sender = msg['sender']
        message = msg['message']
        email = msg['email']
        print("An SMS message from sender %s will be sent to phone: %s with message: %s" % (sender, phone, message))
        try:
        #     print('keys:',settings.AWS_ACCESS_KEY_ID,settings.AWS_SECRET_ACCESS_KEY)
            client = boto3.client(
                "sns",
                region_name='il-central-1',
        #         aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        #         aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            )
        #     print("region:",settings.AWS_REGION_NAME)
        #     # Send your sms message.
            client.set_sms_attributes(attributes={"DefaultSenderID": sender})
        #     ###  ---- # this is the correct code ----
            client.publish(
                PhoneNumber=phone,
                Message=message
            )
            print("message sent to phone: %s" % phone)

            return 0
        except ClientError as e:
            print("Message not sent: %s" % e)

            return 1


"""
sendEmailMessage: a function for sending SMS (text) messages to a phone recipient.
Parameters: msg: A dictionary containing the following strings:
        {   'email': email address of destinatary,
            'sender': email address of sender,
            'subject': the subject text of the email,
            'message': message text,
            'CHARSET': (the charset of the message, default = "UTF-8")
        }
            method: how to send the email. possible values are:
                sendmail (internal method)
                aws (send using AWS sns)
                external (send using an external service - google mail, outlock, etc)
Returns: 0=success / 1=failure
"""

def sendEmailMessage(msg):
    to_email = msg['to_email']
    from_email = msg['from_email']
    subject = msg['subject']
    message = msg['message']
    CHARSET = msg['CHARSET']
    print(f"An email from {from_email} will be sent to {to_email} with subject: {subject} and message: {message}")
    ip = 'https://generic2.hitheal.org.il' 
    ## send using aws sns interface
    #session = boto3.Session(profile_name='sms_sender')
    session = boto3.Session()
    client = session.client("ses",region_name='il-central-1')
    try:
        #Provide the contents of the email.
        response = client.send_email(
            Destination={
            'ToAddresses': [
                to_email,
            ],
            },
            Message={
            'Body': {
                'Html': {
                    'Charset': CHARSET,
                    'Data': message,
                },
                'Text': {
                    'Charset': CHARSET,
                    'Data': message,
                },
            }, 
            'Subject': {
                'Charset': CHARSET,
                'Data': subject,
            },
            },
            Source=from_email,
            # If you are not using a configuration set, comment or delete the
            # following line
            #ConfigurationSetName=CONFIGURATION_SET,
        )
        print("An email was sent to %s" % to_email)
        return 0
    # Display an error if something goes wrong.
    except ClientError as e:
        print(e.response['Error']['Message'])
        return 1
   

def send_email_with_attachment(to_email, from_email, subject, html_body, excel_bytes, file_name="report.xlsx"):

    ses = boto3.client("sesv2", region_name="il-central-1")
    
    ses.send_email(
        FromEmailAddress=from_email,
        Destination={'ToAddresses': [to_email]},
        Content={
            "Simple": {
                "Subject": {"Data": subject, "Charset": "UTF-8"},
                "Body": {
                    "Html": {"Data": html_body, "Charset": "UTF-8"}
                },
                "Attachments": [
                    {
                        "FileName": file_name,
                        "ContentType": (
                            "application/"
                            "vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        ),
                        "ContentDisposition": "ATTACHMENT",
                        "ContentTransferEncoding": "BASE64",
                        "RawContent": excel_bytes,
                    }
                ],
            }
        }
    )

