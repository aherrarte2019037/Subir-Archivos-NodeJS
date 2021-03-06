import express from 'express';
import fileUpload from 'express-fileupload';
import { format } from 'date-fns';


const app = express();
const fileExtensions = ['png', 'jpg', 'gif', 'jpeg' ];


app.set( 'port', 3000 );
app.use( express.json() );
app.use( express.urlencoded({ extended: true }) );
app.use( fileUpload() );


app.listen( app.get('port'), () => {
    console.log(`Server started on port ${app.get('port')}`);
});


app.get('/', (req, res) => {
    res.status(200).send( 'Subir Archivos Con NodeJS y Express' )
});


app.post('/upload/profileImage', async(req, res) => {
    
    if( !req.files ) return res.status(400).send({ fileUploaded: false, error: 'No file found' });
    if( !req.body.user ) return res.status(400).send({ fileUploaded: false, error: 'Missing data' });

    const user = req.body.user;
    const file = req.files?.file;
    const type = file.mimetype.split('/')[1];
    const filename = `profileImg-${user}.${type}`

    if( !fileExtensions.includes(type) ) return res.status(400).send({ fileUploaded: false, error: 'Invalid file extension', extension: type, availableExtensions: fileExtensions });

    try {
        await file.mv( `src/uploads/profileImages/${filename}` );
        res.status(200).send({ fileUploaded: true, filename: `${filename}` });

    } catch (error) {
        res.status(400).send({ fileUploaded: false, error: error });
    }

});