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
	sh('sudo ./build.sh')
       }

       stage('Docker-push') {

          withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', passwordVariable: 'dockerpassword', usernameVariable:'dockerusername')]) {
           sh '''
               docker login -u $dockerusername -p $dockerpassword
               docker push "forwater/player:1.10.1-bronze"
              '''
            }
}

     stage('Docker-deploy'){
	sh '''
	     ansible-playbook -i /home/deploy/ansible/dev-deploy/inventory/dev --extra-vars remote=dev /home/deploy/ansible/dev-deploy/dev-deploy.yml

           '''
}
}


    catch (err) {
        currentBuild.result = "FAILURE"
        throw err
    }

}

