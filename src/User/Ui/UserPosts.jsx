import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import LikePost from "./LikePost";
import { MessageOutlined } from "@ant-design/icons";
import Modal from "./Modal";
import AvatarBtn from "../component/Avatar";
import CreateComment from "./CreateComment";
import PostOwner from "./PostOwner";

const UserPosts = ({ images, id, setFilteredPosts }) => {
  const { _id } = useSelector((state) => state.user);
  const [owner, setOwner] = useState(false);
  const [open, setOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    setOwner(id === _id);
  }, [id, _id]);

  const handleOpenModal = (item) => {
    setComments(item.comments);
    setSelectedImage(item);
    setOpen(true);
  };

  const handleNewComment = useCallback((newComment) => {
    setComments((prevComments) => [...prevComments, newComment]);
    if (selectedImage) {
      setFilteredPosts((prevData) =>
        prevData.map((item) =>
          item._id === selectedImage._id
            ? { ...item, comments: [...item.comments, newComment] }
            : item
        )
      );
    }
  }, [selectedImage, setFilteredPosts]);

  const handleCloseModal = () => {
    setOpen(false);
    setSelectedImage(null);
  };

  const handleDelete = (deletedId) => {
    setFilteredPosts((prevPosts) => prevPosts.filter(post => post._id !== deletedId));
  };

  return (
    <>
      <div className="grid md:grid-cols-3 grid-cols-1 gap-2 p-10">
        {images.map((item, index) => (
          <div key={index} className="relative group" onClick={() => handleOpenModal(item)}>
            <img alt="example" src={item.imageUrl} className="object-cover w-full" />
            <div className="absolute top-0 left-0 w-full h-full hidden group-hover:flex items-center justify-center bg-black bg-opacity-50 z-10 text-white font-bold">
              <LikePost id={item._id} likes={item.likes} />
              <div className="flex gap-2 h-full items-center">
                <MessageOutlined className="text-xl ml-2 cursor-pointer" />
                <h3>{item.comments.length}</h3>
              </div>
              {owner && (
                <PostOwner id={item._id} onDelete={handleDelete} />
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedImage && (
        <Modal isOpen={open} onClose={handleCloseModal}>
          <div className="flex w-[800px] h-[500px]">
            <img alt="example" src={selectedImage.imageUrl} className="rounded-lg object-cover w-1/2" />
            <div className="w-[400px] p-3 bg-white dark:bg-primary-dark">
              <CreateComment id={selectedImage._id} onNewComment={handleNewComment} />
              <div className="p-3 my-2 rounded-lg bg-white dark:bg-primary-dark overflow-y-scroll no-scrollbar h-[300px] shadow-2xl flex flex-col">
                {comments.length > 0 ? comments.map((comment) => (
                  <div className="flex flex-col mx-auto w-full" key={comment.id || comment.content}>
                    <div className="flex gap-2 h-full items-center">
                      <AvatarBtn
                        image={comment.author.profilePicture}
                        spell={comment.author.userName.charAt(0).toUpperCase()}
                      />
                      <h3 className="font-semibold">{comment.author.userName}</h3>
                    </div>
                    <div className="my-1 mx-9 p-1 border px-5 w-fit rounded-lg">
                      <p className="text-base">{comment.content}</p>
                    </div>
                  </div>
                )) : <p>No comments yet.</p>}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

UserPosts.propTypes = {
  images: PropTypes.arrayOf(
    PropTypes.shape({
      imageUrl: PropTypes.string.isRequired,
      likes: PropTypes.array.isRequired,
      comments: PropTypes.array.isRequired,
      _id: PropTypes.string.isRequired,
      hashTag: PropTypes.string.isRequired,
    })
  ).isRequired,
  id: PropTypes.string.isRequired,
  setFilteredPosts: PropTypes.func.isRequired,
};

export default UserPosts;
