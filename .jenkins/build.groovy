node{
       nodejs(nodeJSInstallationName: 'Node 7.9.0') {

    /*
    dir('node_modules') {
        deleteDir()
    }*/
    shortCommit = null

    stage('Checkout'){
        echo 'Get sources from Github'
        //checkout scm
        //git 'https://github.com/catalogueglobal/catalogue_ui'
        git branch: 'integration', url: 'https://github.com/catalogueglobal/catalogue_ui'

        gitCommit = sh(returnStdout: true, script: 'git rev-parse HEAD').trim()
        // short SHA, possibly better for chat notifications, etc.
        shortCommit = gitCommit.take(6)
    }

    stage('Download NodeJS dependencies') {
        echo 'Install dependencies...'
            sh 'npm i'
            //sh "node -v"
            //sh "npm -v"
            //sh "ng version"

    }

    stage('Build') {
        echo 'Building project...'
        sh 'ng build'
        //sh 'ng build -prod'
        //sh 'ls'
    }

    archiveName = 'catalogue-ui-'+shortCommit+'.zip'
    stage('Archiving'){
        echo 'Archive the dist in a zip'
        sh 'zip '+archiveName+' dist/*'
    }

    stage('Upload the archives to Nexus Repo'){
        withCredentials([[$class: 'UsernamePasswordMultiBinding', credentialsId: 'tdf-nexus-deploy',
            usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD']]) {

            sh 'echo uname=$USERNAME pwd=$PASSWORD'
            sh 'curl --fail -u $USERNAME:$PASSWORD --upload-file '+archiveName+' https://tdfint01.tdvdigitalfactory.ovh/nexus/repository/archives/'
        }
    }

    stage ('Docker Build') {
    // Build and push image with Jenkins' docker-plugin
    withDockerServer([uri: "tcp://0.0.0.0:2375"]) {
      withDockerRegistry([credentialsId: 'tdf-docker-repo-credentials', url: "https://tdfint01.tdvdigitalfactory.ovh:8482/"]) {
        // we give the image the same version as the .war package
        def image = docker.build("tdfint01.tdvdigitalfactory.ovh:8482/catalogue-ui:1.0.1", ".")
        //"--build-arg PACKAGE_VERSION=${branchVersion} ./tmp-docker-build-context"
        image.push()
      }
    }
  }

}
}
