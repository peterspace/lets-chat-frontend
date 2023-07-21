import { useEffect, useState } from 'react';

import {
  EditOutlined,
  DeleteOutlined,
  AttachFileOutlined,
  GifBoxOutlined,
  ImageOutlined,
  MicOutlined,
  MoreHorizOutlined,
} from '@mui/icons-material';
import {
  Box,
  Divider,
  Typography,
  InputBase,
  useTheme,
  Button,
  IconButton,
  useMediaQuery,
} from '@mui/material';
import FlexBetween from '../../components/FlexBetween';
import Dropzone from 'react-dropzone';
import UserImage from '../../components/UserImage';
import WidgetWrapper from '../../components/WidgetWrapper';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts } from '../../state';
import PhotosUploader from '../../components/PhotosUploader';

const MyPostWidget = ({ picturePath }) => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const cloudinary = process.env.REACT_APP_CLOUDINARY_URL;
  const dispatch = useDispatch();
  const [isImage, setIsImage] = useState(false);
  const [image, setImage] = useState(null);

  console.log({ image: image });
  const [imageUrl, setImageUrl] = useState(null);
  console.log({ imageUrl: imageUrl });
  const [post, setPost] = useState('');
  const { palette } = useTheme();
  // const { _id } = useSelector((state) => state.user);
  const user = useSelector((state) => state.user);
  console.log({ user: user });
  // const token = useSelector((state) => state.token);
  const isNonMobileScreens = useMediaQuery('(min-width: 1000px)');
  const mediumMain = palette.neutral.mediumMain;
  const medium = palette.neutral.medium;
  // const [ description, setDescription]= useState('');

  const [newUserData, setNewUserData] = useState(null);
  console.log({ newUserData: newUserData });

  const [newPost, setNewPost] = useState(null);
  console.log({ newPost: newPost });

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
      const response1 = await fetch(cloudinary, {
        method: 'post',
        body: imageL,
      });
      const imgData = await response1.json();
      imageURL = imgData.url.toString();
      setImageUrl(imageURL);
    }
  }

  useEffect(() => {
    if (imageUrl) {
      const userData = {
        userId: user?._id,
        firstName: user?.firstName,
        lastName: user?.lastName,
        location: user?.location,
        description: post,
        userPicturePath: user?.picturePath,
        picturePath: imageUrl,
      };

      setNewUserData(userData);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageUrl]);

  const handlePost = async () => {
    if (newUserData) {
      //====={Later 1}===========================
      const response = await fetch(baseUrl + `/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUserData),
      });
      const posts = await response.json();
      setNewPost(posts);

      if (posts?._id) {
        dispatch(setPosts({ posts }));
        setImage(null);
        setPost('');
      }

      //====={Later 2}===========================
    }
  };

  return (
    <WidgetWrapper>
      <FlexBetween gap="1.5rem">
        <UserImage image={picturePath} />
        <InputBase
          placeholder="What's on your mind..."
          onChange={(e) => setPost(e.target.value)}
          value={post}
          sx={{
            width: '100%',
            backgroundColor: palette.neutral.light,
            borderRadius: '2rem',
            padding: '1rem 2rem',
          }}
        />
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

      {/* {isImage && (
        <Box
          border={`1px solid ${medium}`}
          borderRadius="5px"
          mt="1rem"
          p="1rem"
        >
          {preInput('Photos', 'more = better')}
          <PhotosUploader addedPhotos={image} onChange={setImage} />
        </Box>
      )} */}

      <Divider sx={{ margin: '1.25rem 0' }} />

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

        {isNonMobileScreens ? (
          <>
            <FlexBetween gap="0.25rem">
              <GifBoxOutlined sx={{ color: mediumMain }} />
              <Typography color={mediumMain}>Clip</Typography>
            </FlexBetween>

            <FlexBetween gap="0.25rem">
              <AttachFileOutlined sx={{ color: mediumMain }} />
              <Typography color={mediumMain}>Attachment</Typography>
            </FlexBetween>

            <FlexBetween gap="0.25rem">
              <MicOutlined sx={{ color: mediumMain }} />
              <Typography color={mediumMain}>Audio</Typography>
            </FlexBetween>
          </>
        ) : (
          <FlexBetween gap="0.25rem">
            <MoreHorizOutlined sx={{ color: mediumMain }} />
          </FlexBetween>
        )}

        <Button
          disabled={!post}
          onClick={handlePost}
          sx={{
            color: palette.background.alt,
            backgroundColor: palette.primary.main,
            borderRadius: '3rem',
          }}
        >
          POST
        </Button>
      </FlexBetween>
    </WidgetWrapper>
  );
};

export default MyPostWidget;
