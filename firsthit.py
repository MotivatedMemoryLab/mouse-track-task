import boto3;

region_name = 'us-east-1'
aws_access_key_id = 'AKIAIPRMQT5VI4XVZECA'
aws_secret_access_key = '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'

endpoint_url = 'https://mturk-requester-sandbox.us-east-1.amazonaws.com'
# Uncomment this line to use in production

# endpoint_url = 'https://mturk-requester.us-east-1.amazonaws.com'

client = boto3.client(
    'mturk',
    endpoint_url=endpoint_url,
    region_name=region_name,
    aws_access_key_id=aws_access_key_id,
    aws_secret_access_key=aws_secret_access_key,
)

#HIT ID: 37OPIVELUUXC1KHSTUOXPV30U6HHAT

question_file = open("question_meta.txt", "r")
cdata_file = open("cdata.html", "r")
question = question_file.read() % cdata_file.read()
print (question)

#print (question_file.read())


response = client.create_hit(
    MaxAssignments=5,
    AutoApprovalDelayInSeconds=3600,
    LifetimeInSeconds=84600,
    AssignmentDurationInSeconds=1800,
    Reward='1',
    Title='separated HIT no text (correct)',
    Keywords='HIT, Example, N',
    Description='This is my nth attempt at creating a HIT with MTurk.',
    Question=question,  
    RequesterAnnotation='annotation1',
    #QualificationRequirements=[
    #    {
    #        'QualificationTypeId': '00000000000000000071',
    #        'Comparator': 'EqualTo',
    #        'LocaleValues': [
    #            {
    #                'Country': 'US',
    #                'Subdivision': 'NC'
    #            },
    #        ],
    #        'RequiredToPreview': False,
    #        #'ActionsGuarded': "DiscoverPreviewAndAccept",
    #    },
    #],
    UniqueRequestToken='token95'
)

print(response);
