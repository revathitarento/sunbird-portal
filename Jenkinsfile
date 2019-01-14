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

         env.NODE_ENV = "build"

         print "Environment will be : ${env.NODE_ENV}"
         sh('sudo ./build.sh')

       }  
   	stage('Docker-push') {

	withCredentials([string(credentialsId: 'Dock_pass', variable: 'dock-pass')]) {
        sh ('sudo ./dockerPushToRepo.sh')
}
}
 
    }
    catch (err) {
        currentBuild.result = "FAILURE"
        throw err
    }

}
