import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FiMenu } from 'react-icons/fi';
import LinkCard from './LinkCard';

export default function SortableLinkCard({ link, onDelete, onToggle, onEdit }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 999 : 'auto',
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-2">
      <div
        {...attributes}
        {...listeners}
        className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-400 cursor-grab active:cursor-grabbing rounded-lg hover:bg-gray-800 transition-all touch-none"
      >
        <FiMenu size={16} />
      </div>
      <div className="flex-1">
        <LinkCard
          link={link}
          onDelete={onDelete}
          onToggle={onToggle}
          onEdit={onEdit}
        />
      </div>
    </div>
  );
}