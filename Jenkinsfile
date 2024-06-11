import java.text.SimpleDateFormat
import groovy.json.*

def APPLICATION_ID = 708
def PROCESS_ID = [
    CODE_BUILD: 4,
    UNIT_TEST: 4,
    STATIC_CODE_ANALYSIS: 45,
    SECURITY_SCANNING: 19,
    ARTIFACT_MAGT: 50,
    CONTINUOUS_DEPLOYMENT_QA: 31,
    CONTINUOUS_DEPLOYMENT_UAT: 32,
    CONTINUOUS_DEPLOYMENT_PROD: 33
]

def TOOL_ID = [
    JUNIT: 48,
    JENKINS: 9,
    SONAR_QUBE: 22,
    ARTIFACT_MAGT: 242
]

pipeline {
    agent any

    stages {

        stage('Environment') {
            steps {
                sh 'git --version'
                echo "Branch: ${env.BRANCH_NAME}"
                sh 'docker -v'
                sh 'printenv'
            }
        }

        stage('Build') {
            agent {
                docker {
                    image 'node:10.15.3'
                    reuseNode true
                }
            }

            steps {
                withCredentials([string(credentialsId: 'github-npm-token', variable: 'GITH_TOKEN')]) {
                    sh "echo @cbreenterprise:registry=https://npm.pkg.github.com/ >.npmrc"
                    sh "echo //npm.pkg.github.com/:_authToken=${GITH_TOKEN} >>.npmrc"
                    sh 'yarn install'
                    sh 'rm .npmrc'
                }
            }

            post {
                    success {
                        publishMetricsToDevOpsPortal(APPLICATION_ID, 1, env.BUILD_ID, TOOL_ID.JENKINS, PROCESS_ID.CODE_BUILD)
                    }
                }
        }

        stage ('Unit Test  and coverage') {
            agent {
                docker {
                    image 'node:10.15.3'
                    reuseNode true
                }
            }

            steps {
                sh 'yarn coverage'
                step([$class: 'CoberturaPublisher', coberturaReportFile: 'coverage/cobertura-coverage.xml'])
            }
            post {
                success {
                    publishMetricsToDevOpsPortal(APPLICATION_ID, 1, env.BUILD_ID, TOOL_ID.JUNIT, PROCESS_ID.UNIT_TEST)
                }
            }
        }

        stage ('Static code Analisys') {
            agent {
                docker {
                    image 'loyaltyone/docker-alpine-java-node'
                    reuseNode true
                }
            }
            when {
              expression { env.BRANCH_NAME == 'develop' }
            }

            steps {
              sh 'npx sonar-scanner -Dsonar.host.url=https://sq.cbre.com -Dsonar.login=5e3097a4e982a1efff184c0675f38ff222e68bdd'
            }

            post {
                success {
                    publishMetricsToDevOpsPortal(APPLICATION_ID, 1, env.BUILD_ID, TOOL_ID.SONAR_QUBE, PROCESS_ID.STATIC_CODE_ANALYSIS)
                }
            }
        }

        stage('Build and push docker image -> ECR') {
            when {
              expression { env.BRANCH_NAME ==~ /(develop|master)/ }
            }
            steps {
                script {
                    def tag = "${BUILD_NUMBER}"

                    withCredentials([string(credentialsId: 'github-npm-token', variable: 'GITH_TOKEN')]) {
                        def dockerfile = (env.BRANCH_NAME ==~ /(develop|master)/) ? 'Docker/Dockerfile-prod'
                                                                                : 'Dockerfile'

                        def AUTH_TOKEN = env.GITH_TOKEN.trim()
                        def buildArgs = " -f ${dockerfile} --build-arg Environment=dev --build-arg TOKEN=${AUTH_TOKEN} --rm ."
                        echo "Build docker image using dockerfile:'${dockerfile}''"

                        docker.build('ss-frontend', buildArgs)
                        docker.withRegistry("https://577595225843.dkr.ecr.eu-central-1.amazonaws.com", "ecr:eu-central-1:ECR_INS_NONPROD")
                                 {
                                     docker.image('ss-frontend').push(tag)
                                 }
                    }
                }
            }

            post {
              success {
                publishMetricsToDevOpsPortal(APPLICATION_ID, 1, env.BUILD_ID, TOOL_ID.ARTIFACT_MAGT, PROCESS_ID.ARTIFACT_MAGT)
              }
            }
        }

        stage('continuous deployment to DEV environment') {
           when {
              expression { env.BRANCH_NAME == 'develop' }
           }
           steps {
              withAWS(region: 'eu-central-1', credentials:'ECR_INS_NONPROD') {
                  sh '''
                     MY_MANIFEST=$(aws2 ecr batch-get-image --repository-name ss-frontend --image-ids imageTag=${BUILD_NUMBER} --region eu-central-1 --query images[].imageManifest --output text)
                     aws2 ecr put-image --repository-name ss-frontend --image-tag dev --image-manifest "$MY_MANIFEST" --region eu-central-1
                     '''
                  sh 'aws2 ecs update-service --cluster as-ss-dev --service ss-webui-app --force-new-deployment'
              }
           }
           post {
               success {
                   publishMetricsToDevOpsPortal(APPLICATION_ID, 1, env.BUILD_ID , TOOL_ID.JENKINS, PROCESS_ID.CONTINUOUS_DEPLOYMENT_QA)
               }
           }
        }

        stage('continuous deployment to TEST environment') {
           when {
              expression { env.BRANCH_NAME == 'develop' }
           }
           steps {
              withAWS(region: 'eu-central-1', credentials:'ECR_INS_NONPROD') {
                  sh '''
                     MY_MANIFEST=$(aws2 ecr batch-get-image --repository-name ss-frontend --image-ids imageTag=${BUILD_NUMBER} --region eu-central-1 --query images[].imageManifest --output text)
                     aws2 ecr put-image --repository-name ss-frontend --image-tag test --image-manifest "$MY_MANIFEST" --region eu-central-1
                     '''
                  sh 'aws2 ecs update-service --cluster as-ss-test --service ss-webui-app --force-new-deployment'
              }
           }
           post {
               success {
                   publishMetricsToDevOpsPortal(APPLICATION_ID, 1, env.BUILD_ID , TOOL_ID.JENKINS, PROCESS_ID.CONTINUOUS_DEPLOYMENT_QA)
               }
           }
        }

        stage('continuous deployment to UAT environment') {
           when {
              expression { env.BRANCH_NAME == 'develop' }
           }
           steps {
              withAWS(region: 'eu-central-1', credentials:'ECR_INS_NONPROD') {
                  sh '''
                     MY_MANIFEST=$(aws2 ecr batch-get-image --repository-name ss-frontend --image-ids imageTag=${BUILD_NUMBER} --region eu-central-1 --query images[].imageManifest --output text)
                     aws2 ecr put-image --repository-name ss-frontend --image-tag uat --image-manifest "$MY_MANIFEST" --region eu-central-1
                     '''
                  //sh 'aws2 ecs update-service --cluster as-ss-uat --service ss-webui-app --force-new-deployment'
              }
           }
           post {
               success {
                   publishMetricsToDevOpsPortal(APPLICATION_ID, 1, env.BUILD_ID , TOOL_ID.JENKINS, PROCESS_ID.CONTINUOUS_DEPLOYMENT_UAT)
               }
           }
        }

    }
    post {
        always {
            cleanWs()
        }
    }
}


def publishMetricsToDevOpsPortal(appId, version, cycleNumber, toolId, processId) {
    println("*****Publish metric to DevOps portal: ")
    println("**applicationId:${appId};")
    println("**version:${version};")
    println("**build: ${cycleNumber};")
    println("**tool: ${toolId}")
    println("**processId: ${processId}")

    def body = generateRequestBody(appId, version, cycleNumber, toolId, processId)
    def bodyJson = JsonOutput.toJson(body)

    println("Request Body: " + bodyJson)

    def response = httpRequest consoleLogResponseBody: true, customHeaders: [
            [maskValue: false, name: 'Authorization', value: 'Basic bWV0cmljdXNlcjpZUnVLcWdFQ1ZNUjZjaG9MUHlraFVwZA==']
        ],
        httpMode: 'POST',
        requestBody: "${bodyJson}",
        url: 'https://devopsmetrics.cbre.com/api/v2/metrics'

    println("Status: " + response.status)
    println("Content: " + response.content)
}

def formatDate() {
    dateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss")
    formattedDate = dateFormat.format(new Date())
    println("formated date :'${formattedDate}'")

    return formattedDate;
}

def generateRequestBody(appId, version, buildCycle, toolId, processId) {
    def formattedDate = formatDate()
    def body = [
        "ApplicationId": appId,
        "AutomationProcessId": processId,
        "AutomationToolId": toolId,
        "Description": "[Description]",
        "Version": 1,
        "Cycle": buildCycle,
        "Passed": 0,
        "Failed": 0,
        "Blocked": 0,
        "StartDateTime": "${formattedDate}",
        "EndDateTime": "${formattedDate}",
        "Metadata": ""
    ]

    return body;
}
