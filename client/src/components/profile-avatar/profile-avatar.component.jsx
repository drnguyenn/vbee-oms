import { useSelector } from 'react-redux';

import {
  IconButton,
  Backdrop,
  CircularProgress,
  Tooltip,
  makeStyles
} from '@material-ui/core';
import { PhotoCamera } from '@material-ui/icons';

import {
  ProfileAvatarStyles,
  UserAvatarAndUploadButton,
  UserAvatar,
  FileInput
} from './profile-avatar.styles';

// import { updateAvatarStart } from '../../redux/auth/auth.actions';

const useStyles = makeStyles({
  backdrop: { position: 'absolute', zIndex: 1 }
});

const ProfileAvatar = () => {
  const classes = useStyles();

  const { currentUser, isUpdatingAvatar } = useSelector(state => state.auth);

  // const dispatch = useDispatch();

  // const FileTooLargeMessage = () => (
  //   <p>
  //     Your image seems to be larger than 2 MB.
  //     <br />
  //     That&aposs way too much. Maybe consider reducing it&aposs size ?
  //   </p>
  // );

  // const handleUploadClick = async event => {
  // const file = event.target.files[0];
  // if (file) {
  //   if (file.size > 2097152) {
  //     // setSnackbar({
  //     //   open: true,
  //     //   message: <FileTooLargeMessage />
  //     // });
  //     return;
  //   }
  // }
  // const data = new FormData();
  // data.append('avatar', file);
  // dispatch(updateAvatarStart(data));
  // };

  return (
    <ProfileAvatarStyles>
      <UserAvatarAndUploadButton>
        <UserAvatar
          style={{ backgroundImage: `url(${currentUser.avatarUrl})` }}
        >
          <Backdrop className={classes.backdrop} open={isUpdatingAvatar}>
            <CircularProgress color='inherit' />
          </Backdrop>
        </UserAvatar>
        <FileInput
          id='upload-button'
          name='avatarUrl'
          type='file'
          accept='image/*'
          // onChange={handleUploadClick}
        />
        <Tooltip title='Upload an avatar' arrow>
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label htmlFor='upload-button'>
            <IconButton component='span' color='inherit'>
              <PhotoCamera />
            </IconButton>
          </label>
        </Tooltip>
      </UserAvatarAndUploadButton>
    </ProfileAvatarStyles>
  );
};

export default ProfileAvatar;
