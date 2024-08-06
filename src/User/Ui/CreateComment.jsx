import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import AvatarBtn from '../component/Avatar';
import { Button, message } from 'antd';
import { commentPost } from '../auth/authUser';
import PropTypes from 'prop-types';

const CreateComment = ({ postId, onNewComment }) => {
  const { user } = useSelector(state => state);
  const [comment, setComment] = useState(''); // Manage input state
  const [loading, setLoading] = useState(false); // Manage loading state
  const textareaRef = useRef(null); // Ref for the textarea

  const handleCommentChange = (event) => {
    setComment(event.target.value); // Update comment state
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // Reset the height
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set the height to the scrollHeight
    }
  }, [comment]);

  const handleSubmit = async () => {
    if (comment.trim() === '') {
      message.error('Comment cannot be empty');
      return;
    }

    setLoading(true); // Set loading state to true
    try {
      const response = await commentPost(postId, comment);
      message.success('Comment posted successfully'); // Show success message
      setComment('');
      onNewComment(response.data.result.comments); // Notify parent component
    } catch (error) {
      message.error('Failed to post comment');
    } finally {
      setLoading(false); // Set loading state back to false
    }
  };

  const handleCancel = () => {
    setComment(''); // Clear the comment input
  };

  return (
    <div className='p-2 gap-2 bg-white dark:bg-primary-dark flex flex-col border-0 shadow-2xl rounded-lg'>
      <div className='flex gap-2'>
        <AvatarBtn image={user.profilePicture} />
        <h2>{user.userName || 'Anonymous'}</h2>
      </div>
      <textarea
        ref={textareaRef}
        placeholder='What are your thoughts?'
        className='dark:bg-inherit dark:text-white pb-4 px-2 active:border-0 text-md font-Jakarta resize-none overflow-hidden'
        value={comment}
        onChange={handleCommentChange}
        rows={2} // Set a minimum number of rows
      />
      <div className='flex justify-end gap-2 h-full items-center'>
        <h3 className='cursor-pointer' onClick={handleCancel}>Cancel</h3>
        <Button
          className='rounded-full text-white shadow-xl bg-[#beefb6]'
          onClick={handleSubmit}
          loading={loading} // Show loading state
        >
          Respond
        </Button>
      </div>
    </div>
  );
};

CreateComment.propTypes = {
  postId: PropTypes.string.isRequired,
  onNewComment: PropTypes.func.isRequired,
};

export default CreateComment;
