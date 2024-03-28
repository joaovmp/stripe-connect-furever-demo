import {useEmbeddedComponentBorder} from '@/app/hooks/EmbeddedComponentBorderProvider';

const EmbeddedComponentContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const {enableBorder} = useEmbeddedComponentBorder();

  return (
    <div
      className={`${enableBorder ? 'border-2 border-dashed rounded-md p-[6px] border-primary' : 'p-[8px]'}`}
    >
      {children}
    </div>
  );
};

export default EmbeddedComponentContainer;
