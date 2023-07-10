echo "Starting to creating backend pipeline"
#!/bin/bash -x
REGION=$(aws configure get region)
Environment=qa

sam deploy -t pipeline.yaml  --stack-name qa-myiq-backend-nodejs-pipeline --region=eu-west-2 --capabilities=CAPABILITY_NAMED_IAM CAPABILITY_AUTO_EXPAND  --parameter-overrides "ParameterKey=Environment,ParameterValue=${Environment}"

#sam deploy -t pipeline.yaml  --stack-name qa-myiq-backend-nodejs-pipeline --region=eu-west-2 --capabilities=CAPABILITY_NAMED_IAM CAPABILITY_AUTO_EXPAND --profile iQuant-dev --parameter-overrides "ParameterKey=GitHubOAuthToken,ParameterValue=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"