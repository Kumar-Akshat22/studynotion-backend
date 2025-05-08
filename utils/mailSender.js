import nodemailer from 'nodemailer'

let transporter = nodemailer.createTransport({

    host: "smtp.gmail.com",
    port: 465,
    secure:true,
    auth: {

        user: "kr22akshat@gmail.com",
        pass: "rfqi kuza rgkz aqmx",
    }
})

const mailSender = async (email , title , body) => {
    
    try {

        const info = await transporter.sendMail({
            
            from: `StudyNotion - Edtech platform`,
            to: `${email}`,
            subject: `${title}`,
            html: `${body}`


          });

          console.log(info)
          return info;

    } catch (error) {
        
        console.log(error.message);
        return error
    }
}

export default mailSender;