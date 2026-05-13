const version = require('./package.json').version;

const fs = require('fs');
const { XMLParser } = require('fast-xml-parser');
const pom = fs.readFileSync('pom.xml').toString();
const pomDocument = new XMLParser().parse(pom);

const webpack = require('webpack');
module.exports = {
    configureWebpack: {
        plugins: [
            new webpack.DefinePlugin({
                'process.env.PACKAGE_VERSION' : '"' + version + '"',
                'process.env.GROUP_ID' : '"' + pomDocument.project.groupId + '"',
                'process.env.ARTIFACT_ID' : '"' + pomDocument.project.artifactId + '"',
            })
        ]
    },
};