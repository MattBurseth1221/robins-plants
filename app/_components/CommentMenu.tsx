import {
    Menu,
    MenuButton,
    MenuItems,
    MenuItem
} from "@headlessui/react";

import { faEllipsis } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function CommentMenu() {
    return (
        <Menu>
            <MenuButton><FontAwesomeIcon className="opacity-80" icon={faEllipsis} /></MenuButton>
        </Menu>
    )
}