#!groovy

node('master') {

    currentBuild.result = "SUCCESS"

    try {

       stage('Checkout'){

          checkout scm
       }

       stage('Pre-Build'){

         sh('sudo ./installDeps.sh')

       }

       stage('Build'){

       }
        stage('Docker-push') {

          withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', passwordVariable: 'dockerpassword', usernameVariable:'dockerusername')]) {
           sh '''
               docker login -u $dockerusername -p $dockerpassword
               docker push "forwater/player:1.10.0-bronze"
              '''
            }

}
}


    catch (err) {
        currentBuild.result = "FAILURE"
        throw err
    }

}

