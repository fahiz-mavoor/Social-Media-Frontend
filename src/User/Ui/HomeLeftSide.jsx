import { Link } from 'react-router-dom';
import Avatar from '../component/Avatar';
import PropTypes from 'prop-types';
import SearchUser from './SearchUser';
const HomeLeftSide = ({ data }) => {
  console.log('data', data);

  const combined = [...data.following, ...data.followers];

  const uniqueMap = new Map();
  combined.forEach(item => {
    uniqueMap.set(item._id, item);
  });
  
  const allFriends = Array.from(uniqueMap.values());
  return (
    <div className="lg:flex leftHomeSideBar flex-col col-span-2 shadow-md hidden gap-4 p-5 px-3 bg-secondary-light dark:bg-secondary-dark rounded-3xl h-[88vh]">
    <div className=' flex   '>
    <SearchUser />
    </div>
      <h2 className=" ">Friends</h2>
      <div className="flex flex-col gap-4 overflow-y-scroll no-scrollbar">
        {allFriends.length === 0 ? (
          <p>No friends found</p>
        ) : (
          allFriends.map((friend, index) => (
            <div className='flex gap-3 ' key={index}>
              {
                console.log(friend)
              }
              <Avatar image={friend.profilePicture }/>
             <Link to={`/profile/${friend._id}`}>
             {friend.userName}</Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Define PropTypes for the component
HomeLeftSide.propTypes = {
  data: PropTypes.shape({
    followers: PropTypes.arrayOf(
      PropTypes.shape({
        profilePicture: PropTypes.string,
        userName: PropTypes.string.isRequired,
      })
    ).isRequired,
    followings: PropTypes.arrayOf(
      PropTypes.shape({
        profilePicture: PropTypes.string,
        userName: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
};

export default HomeLeftSide;
