import React from 'react';
import styles from '../../assets/scroller.module.css';
import * as ScrollArea from '@radix-ui/react-scroll-area';

function ContentScroller({ played =false, children }) {
  return (
    <ScrollArea.Root type="auto" className={styles.ScrollAreaRoot}>
      <ScrollArea.Viewport className={styles.ScrollAreaViewport}>
        { children }
      </ScrollArea.Viewport>
      { played && 
        <ScrollArea.Scrollbar className={styles.ScrollAreaScrollbar} orientation="vertical">
          <ScrollArea.Thumb className={styles.ScrollAreaThumb} />
        </ScrollArea.Scrollbar>
      }
      <ScrollArea.Corner className={styles.ScrollAreaCorner} />
    </ScrollArea.Root>
  );
}

export default ContentScroller;
