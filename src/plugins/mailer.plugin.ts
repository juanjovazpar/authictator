import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import mailer, { Transporter } from 'nodemailer';

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SMTP_FROM = process.env.SMTP_FROM;

export default fp(async function (fastify: FastifyInstance) {
    try {
        if (!(SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS && SMTP_FROM)) {
            console.log('Mising variables to set mailer');
            return;
        }

        const transporter: Transporter = mailer.createTransport({
            host: SMTP_HOST,
            port: Number(SMTP_PORT),
            secure: false,
            auth: {
                user: SMTP_USER,
                pass: SMTP_PASS,
            },
        });

        fastify.decorate(
            'sendEmail',
            async function (to: string, subject: string, text: string) {
                try {
                    await transporter.sendMail({
                        from: SMTP_FROM,
                        to,
                        subject,
                        text,
                    });
                } catch (error) {
                    fastify.log.info('Error sending email:');
                    fastify.log.error(error);
                }
            },
        );
    } catch (error) {
        fastify.log.info('Setting up mailer:');
        fastify.log.error(error);
    }
});
