class EmailReader {
    
    static read(email, subject){
        var imaps = require('imap-simple');
        const simpleParser = require('mailparser').simpleParser;
        const _ = require('lodash');
        var config = {
            imap: {
                user: process.env.EMAIL,
                password: process.env.EMAIL_PW,
                host: 'imap.gmail.com',
                port: 993,
                tlsOptions: {
                    servername: "imap.gmail.com",
                },
                tls: true,
                authTimeout: 3000
            }
        };

        return imaps.connect(config).then( (connection) => {
            return connection.openBox('INBOX')
                .then(() => {
                var searchCriteria = [
                    'UNSEEN' , 
                    ['TO', email] ,
                    ['SUBJECT', subject]
                ];
        
                var fetchOptions = {
                    bodies: ['HEADER', 'TEXT', ''],
                    markSeen: false
                };
        
                return connection.search(searchCriteria, fetchOptions).then((messages) => {
                    messages.forEach((item) => {
                        var all = _.find(item.parts, { "which": "" })
                        var id = item.attributes.uid;
                        var idHeader = "Imap-Id: "+id+"\r\n";
                        simpleParser(idHeader+all.body, (err, mail) => {
                            return mail.text;
                        });
                    });
                });
            });
        });
    }
}

export default EmailReader;