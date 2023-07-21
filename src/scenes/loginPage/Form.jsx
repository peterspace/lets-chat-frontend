import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Divider,
  TextField,
  useMediaQuery,
  IconButton,
  Typography,
  useTheme,
} from '@mui/material';
import {
  EditOutlined,
  DeleteOutlined,
  AttachFileOutlined,
  GifBoxOutlined,
  ImageOutlined,
  MicOutlined,
  MoreHorizOutlined,
} from '@mui/icons-material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
// import { setLogin } from "state";
import { setLogin } from '../../state';
import Dropzone from 'react-dropzone';
import FlexBetween from '../../components/FlexBetween';

import PhotosUploader from '../../components/PhotosUploader';

const registerSchema = yup.object().shape({
  firstName: yup.string().required('required'),
  lastName: yup.string().required('required'),
  email: yup.string().email('invalid email').required('required'),
  password: yup.string().required('required'),
  location: yup.string().required('required'),
  occupation: yup.string().required('required'),
  picture: yup.string().required('required'),
});

const loginSchema = yup.object().shape({
  email: yup.string().email('invalid email').required('required'),
  password: yup.string().required('required'),
});

const initialValuesRegister = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  location: '',
  occupation: '',
  picture: '',
};

const initialValuesLogin = {
  email: '',
  password: '',
};

const Form = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const cloudinary = process.env.REACT_APP_CLOUDINARY_URL;
  console.log({ baseUrl: baseUrl, cloudinary: cloudinary });
  const [pageType, setPageType] = useState('login');
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery('(min-width:600px)');
  const mediumMain = palette.neutral.mediumMain;
  const medium = palette.neutral.medium;
  const isLogin = pageType === 'login';
  const isRegister = pageType === 'register';
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [location, setLocation] = useState('');
  const [occupation, setOccupation] = useState('');
  // const [picture, setPicture] = useState('');
  const [fullData, setFullData] = useState('');

  const [isImage, setIsImage] = useState(false);
  const [image, setImage] = useState(null);
  console.log({ image: image });

  const [imageUrl, setImageUrl] = useState(null);
  console.log({ imageUrl: imageUrl });

  console.log({ fullData: fullData });

  // const [addedPhotos, setAddedPhotos] = useState([]);

  useEffect(() => {
    if (image) {
      getFileUrl();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [image]);

  async function getFileUrl() {
    let imageURL;

    if (
      image &&
      (image.type === 'image/jpeg' ||
        image.type === 'image/jpg' ||
        image.type === 'image/png')
    ) {
      const imageL = new FormData();
      imageL.append('file', image);
      imageL.append('cloud_name', 'datkh2oxv');
      imageL.append('upload_preset', 'kxxtmdn1');

      // First save imageL to cloudinary
      // const response1 = await fetch(cloudinary, {
      const response1 = await fetch(cloudinary, {
        method: 'post',
        body: imageL,
      });
      const imgData = await response1.json();
      imageURL = imgData.url.toString();
      setImageUrl(imageURL);
    }
  }

  const register = async () => {
    const userData = {
      firstName,
      lastName,
      email,
      password,
      location,
      occupation,
      picturePath: imageUrl,
    };
    setFullData(userData);
    const savedUserResponse = await fetch(baseUrl + '/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    const savedUser = await savedUserResponse.json();
    resetForm();

    if (savedUser) {
      setPageType('login');
    }
  };

  const login = async () => {
    const userData = {
      email,
      password,
    };

    setFullData(userData);

    const loggedInResponse = await fetch(baseUrl + '/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    const loggedIn = await loggedInResponse.json();
    resetForm();
    if (loggedIn) {
      dispatch(
        setLogin({
          user: loggedIn.user,
          token: loggedIn.token,
        })
      );
      navigate('/home');
    }
  };

  const handleFormSubmit = async () => {
    if (isLogin) await login();
    if (isRegister) await register();
  };

  const resetForm = async () => {
    if (isLogin) {
      setEmail('');
      setPassword('');
    }
    if (isRegister) {
      setFirstName('');
      setLastName('');
      setEmail('');
      setPassword('');
      setLocation('');
      setOccupation('');
      // setPicture('');
    }
  };

  return (
    <div>
      <Box
        display="grid"
        gap="30px"
        gridTemplateColumns="repeat(4, minmax(0, 1fr))"
        sx={{
          '& > div': { gridColumn: isNonMobile ? undefined : 'span 4' },
        }}
      >
        {isRegister && (
          <>
            <TextField
              label="First Name"
              onChange={(e) => setFirstName(e.target.value)}
              value={firstName}
              name="firstName"
              sx={{ gridColumn: 'span 2' }}
            />
            <TextField
              label="Last Name"
              onChange={(e) => setLastName(e.target.value)}
              value={lastName}
              name="lastName"
              sx={{ gridColumn: 'span 2' }}
            />
            <TextField
              label="Location"
              onChange={(e) => setLocation(e.target.value)}
              value={location}
              name="location"
              sx={{ gridColumn: 'span 4' }}
            />
            <TextField
              label="Occupation"
              onChange={(e) => setOccupation(e.target.value)}
              value={occupation}
              name="occupation"
              sx={{ gridColumn: 'span 4' }}
            />
            {/* <Divider sx={{ margin: '1.25rem 0' }} /> */}

            <FlexBetween>
              <FlexBetween gap="0.25rem" onClick={() => setIsImage(!isImage)}>
                <ImageOutlined sx={{ color: mediumMain }} />
                <Typography
                  color={mediumMain}
                  sx={{ '&:hover': { cursor: 'pointer', color: medium } }}
                >
                  Image
                </Typography>
              </FlexBetween>
            </FlexBetween>
            {isImage && (
              <Box
                border={`1px solid ${medium}`}
                borderRadius="5px"
                mt="1rem"
                p="1rem"
              >
                <Dropzone
                  acceptedFiles=".jpg,.jpeg,.png"
                  multiple={false}
                  onDrop={(acceptedFiles) => setImage(acceptedFiles[0])}
                >
                  {({ getRootProps, getInputProps }) => (
                    <FlexBetween>
                      <Box
                        {...getRootProps()}
                        border={`2px dashed ${palette.primary.main}`}
                        p="1rem"
                        width="100%"
                        sx={{ '&:hover': { cursor: 'pointer' } }}
                      >
                        <input {...getInputProps()} />
                        {!image ? (
                          <p>Add Image Here</p>
                        ) : (
                          <FlexBetween>
                            <Typography>{image.name}</Typography>
                            <EditOutlined />
                          </FlexBetween>
                        )}
                      </Box>
                      {image && (
                        <IconButton
                          onClick={() => setImage(null)}
                          sx={{ width: '15%' }}
                        >
                          <DeleteOutlined />
                        </IconButton>
                      )}
                    </FlexBetween>
                  )}
                </Dropzone>
              </Box>
            )}
          </>
        )}

        <TextField
          label="Email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          name="email"
          sx={{ gridColumn: 'span 4' }}
        />
        <TextField
          label="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          name="password"
          sx={{ gridColumn: 'span 4' }}
        />
      </Box>

      {/* BUTTONS */}
      <Box>
        <Button
          fullWidth
          type="submit"
          sx={{
            m: '2rem 0',
            p: '1rem',
            backgroundColor: palette.primary.main,
            color: palette.background.alt,
            '&:hover': { color: palette.primary.main },
          }}
          onClick={() => handleFormSubmit()}
        >
          {isLogin ? 'LOGIN' : 'REGISTER'}
        </Button>
        <Typography
          onClick={() => {
            setPageType(isLogin ? 'register' : 'login');
            resetForm();
          }}
          sx={{
            textDecoration: 'underline',
            color: palette.primary.main,
            '&:hover': {
              cursor: 'pointer',
              color: palette.primary.light,
            },
          }}
        >
          {isLogin
            ? "Don't have an account? Sign Up here."
            : 'Already have an account? Login here.'}
        </Typography>
      </Box>
    </div>
  );
};

export default Form;
