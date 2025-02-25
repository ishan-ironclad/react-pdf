'use client';

import React from 'react';
import clsx from 'clsx';
import invariant from 'tiny-invariant';

import Page from './Page';

import { isProvided } from './shared/utils';

import useDocumentContext from './shared/hooks/useDocumentContext';

import type { PageProps } from './Page';
import type { ClassName, OnItemClickArgs } from './shared/types';

export type ThumbnailProps = Omit<
  PageProps,
  | 'className'
  | 'customTextRenderer'
  | 'onGetAnnotationsError'
  | 'onGetAnnotationsSuccess'
  | 'onGetTextError'
  | 'onGetTextSuccess'
  | 'onRenderAnnotationLayerError'
  | 'onRenderAnnotationLayerSuccess'
  | 'onRenderTextLayerError'
  | 'onRenderTextLayerSuccess'
  | 'renderAnnotationLayer'
  | 'renderForms'
  | 'renderTextLayer'
> & {
  className?: ClassName;
  onItemClick?: (args: OnItemClickArgs) => void;
};

export default function Thumbnail(props: ThumbnailProps) {
  const documentContext = useDocumentContext();

  invariant(
    documentContext,
    'Unable to find Document context. Did you wrap <Page /> in <Document />?',
  );

  const mergedProps = { ...documentContext, ...props };
  const {
    className,
    linkService,
    onItemClick,
    pageIndex: pageIndexProps,
    pageNumber: pageNumberProps,
  } = mergedProps;

  const pageIndex = isProvided(pageNumberProps) ? pageNumberProps - 1 : pageIndexProps ?? null;

  const pageNumber = pageNumberProps ?? (isProvided(pageIndexProps) ? pageIndexProps + 1 : null);

  function onClick(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();

    if (!isProvided(pageIndex) || !pageNumber) {
      return;
    }

    if (onItemClick) {
      onItemClick({
        pageIndex,
        pageNumber,
      });
    } else {
      linkService.goToPage(pageNumber);
    }
  }

  const { className: classNameProps, onItemClick: onItemClickProps, ...pageProps } = props;

  return (
    /* eslint-disable-next-line jsx-a11y/anchor-is-valid */
    <a
      className={clsx('react-pdf__Thumbnail', className)}
      href={pageNumber ? '#' : undefined}
      onClick={onClick}
    >
      <Page
        {...pageProps}
        _className="react-pdf__Thumbnail__page"
        _enableRegisterUnregisterPage={false}
        renderAnnotationLayer={false}
        renderTextLayer={false}
      />
    </a>
  );
}
