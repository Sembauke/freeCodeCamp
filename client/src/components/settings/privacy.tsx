import React from 'react';
import { useTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { Button, Spacer } from '@freecodecamp/ui';

import { userSelector } from '../../redux/selectors';

import FullWidthRow from '../helpers/full-width-row';
import SectionHeader from './section-header';

const mapStateToProps = createSelector(userSelector, user => ({
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  user
}));

type PrivacyProps = {
  user: {
    username: string;
  };
};

function PrivacySettings({ user }: PrivacyProps): JSX.Element {
  const { t } = useTranslation();

  return (
    <div className='privacy-settings' id='privacy-settings'>
      <SectionHeader>{t('settings.headings.privacy')}</SectionHeader>
      <FullWidthRow>
        <p>{t('settings.privacy')}</p>
      </FullWidthRow>
      <FullWidthRow>
        <Spacer size='m' />
        <p>{t('settings.data')}</p>
        <Button
          block={true}
          size='large'
          variant='primary'
          download={`${user.username}.json`}
          href={`data:text/json;charset=utf-8,${encodeURIComponent(
            JSON.stringify(user)
          )}`}
        >
          {t('buttons.download-data')}
        </Button>
      </FullWidthRow>
    </div>
  );
}

PrivacySettings.displayName = 'PrivacySettings';

export default connect(
  mapStateToProps,
  null
)(withTranslation()(PrivacySettings));
