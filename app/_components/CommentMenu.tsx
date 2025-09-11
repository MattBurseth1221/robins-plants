"use client";

import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";

import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import DeleteCommentDialog from "./DeleteCommentDialog";
import { CommentType } from "./PostContainer";
import UpdateCommentDialog from "./UpdateCommentDialog";

export default function CommentMenu({comment}: {comment: CommentType}) {
  const [showDeleteCommentModal, setShowDeleteCommentModal] =
    useState<boolean>(false);
  const [showUpdateCommentModal, setShowUpdateCommentModal] = useState<boolean>(false);

  const DeleteCommentDialogProps = {
    comment,
    showDeleteCommentModal,
    setShowDeleteCommentModal,
  };

  const UpdateCommentDialogProps = {
    comment,
    showUpdateCommentModal,
    setShowUpdateCommentModal,
  };

  const menuItemStyle =
    "block p-2 rounded-md hover:bg-slate-500 hover:text-white transition";

  return (
    <div className="ml-2">
      <Menu>
        <MenuButton>
          <FontAwesomeIcon className="opacity-80" icon={faEllipsis} />
        </MenuButton>
        <MenuItems
          anchor="bottom"
          transition
          className="p-2 bg-slate-200 border-gray-400 rounded-md border-2 origin-top transition duration-200 ease-out data-[closed]:scale-95 data-[closed]:opacity-0"
        >
          <MenuItem>
            <button className={menuItemStyle} onClick={() => setShowUpdateCommentModal(true)}>Edit</button>
          </MenuItem>
          <MenuItem>
            <button
              className={menuItemStyle}
              onClick={() => setShowDeleteCommentModal(true)}
            >
              Delete
            </button>
          </MenuItem>
        </MenuItems>
      </Menu>

      <DeleteCommentDialog {...DeleteCommentDialogProps} />
      <UpdateCommentDialog {...UpdateCommentDialogProps} />
    </div>
  );
}
