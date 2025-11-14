// src/components/icons/ClientesIcons.jsx

import ViewIcon from '@assets/ViewIcon.svg';
import UpdateIcon from '@assets/updateIcon.svg';
import PasskeyIcon from '@assets/PasskeyIcon.svg';
import DeleteIcon from '@assets/deleteIcon.svg';
import ChevronDownIcon from '@assets/ChevronDownIcon.svg';
import XIcon from '@assets/XIcon.svg';
import PersonIcon from '@assets/PersonIcon.svg';
import IdentityCardIcon from '@assets/IdentityCardIcon.svg';

// Componentes wrapper para los iconos
export const Icon = ({ src, alt = "", className = "w-5 h-5" }) => (
  <img src={src} alt={alt} className={className} />
);

export const icons = {
  view: ViewIcon,
  update: UpdateIcon,
  passkey: PasskeyIcon,
  delete: DeleteIcon,
  chevronDown: ChevronDownIcon,
  x: XIcon,
  person: PersonIcon,
  identityCard: IdentityCardIcon
};

export default icons;