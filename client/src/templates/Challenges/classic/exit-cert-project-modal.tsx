import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Modal, Spacer } from '@freecodecamp/ui';

interface ExitCertProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExit: () => void;
}

const ExitCertProjectModal = ({
  isOpen,
  onClose,
  onExit
}: ExitCertProjectModalProps) => {
  const { t } = useTranslation();

  return (
    <Modal onClose={onClose} open={isOpen} variant='danger'>
      <Modal.Header closeButtonClassNames='close'>
        {t('learn.cert-project.exit-modal-header')}
      </Modal.Header>
      <Modal.Body alignment='center'>
        {t('learn.cert-project.exit-modal-body')}
      </Modal.Body>
      <Modal.Footer>
        <Button block variant='primary' onClick={onClose}>
          {t('learn.cert-project.exit-modal-no')}
        </Button>
        <Spacer size='xxs' />
        <Button block variant='danger' onClick={onExit}>
          {t('learn.cert-project.exit-modal-yes')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

ExitCertProjectModal.displayName = 'ExitCertProjectModal';

export default ExitCertProjectModal;
