import eventBus from '@/eventBus';

export default function gotoPage(PageName, PageParams) {
  eventBus.$emit('gotoPage', PageName, PageParams);
}