import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config';
import { createPinia } from 'pinia'
import ToastService from 'primevue/toastservice';

import Avatar from 'primevue/avatar';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import FileUpload from 'primevue/fileupload';
import InputMask from 'primevue/inputmask';
import InputNumber from 'primevue/inputnumber';
import InputSwitch from 'primevue/inputswitch';
import InputText from 'primevue/inputtext';
import Checkbox from 'primevue/checkbox';
import Menu from 'primevue/menu';
import Ripple from 'primevue/ripple';
import Sidebar from 'primevue/sidebar';
import StyleClass from 'primevue/styleclass';
import Tooltip from 'primevue/tooltip';
import Toast from 'primevue/toast';
import ProgressBar from 'primevue/progressbar';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';
import Row from 'primevue/row';
import Image from 'primevue/image';
import Dropdown from 'primevue/dropdown';
import RadioButton from 'primevue/radiobutton';
import OrderList from 'primevue/orderlist';
import Card from 'primevue/card';
import Paginator from 'primevue/paginator';
import Panel from 'primevue/panel';
import Tag from 'primevue/tag';
import Fieldset from 'primevue/fieldset';
import Listbox from 'primevue/listbox';
import Editor from 'primevue/editor';
import AutoComplete from 'primevue/autocomplete';
import Splitter from 'primevue/splitter';
import SplitterPanel from 'primevue/splitterPanel';
import Divider from 'primevue/divider'
import Skeleton from 'primevue/skeleton'

import 'primevue/resources/themes/saga-blue/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'

const app = createApp(App)

app.use(PrimeVue);
app.use(router);
app.use(ToastService);

app.component('Skeleton', Skeleton);
app.component('Divider', Divider);
app.component('SplitterPanel', SplitterPanel);
app.component('AutoComplete', AutoComplete);
app.component('Splitter', Splitter);
app.component('Editor', Editor);
app.component('Listbox', Listbox);
app.component('Fieldset', Fieldset);
app.component('Tag', Tag);
app.component('Panel', Panel);
app.component('Paginator', Paginator);
app.component('Card', Card);
app.component('OrderList', OrderList);
app.component('RadioButton', RadioButton);
app.component('Dropdown', Dropdown);
app.component('Image', Image);
app.component('Avatar', Avatar);
app.component('Button', Button);
app.component('Dialog', Dialog);
app.component('FileUpload', FileUpload);
app.component('InputMask', InputMask);
app.component('InputNumber', InputNumber);
app.component('InputSwitch', InputSwitch);
app.component('InputText', InputText);
app.component('Checkbox', Checkbox);
app.component('ProgressBar', ProgressBar);
app.component('Menu', Menu);
app.component('Sidebar', Sidebar);
app.component('Toast', Toast);
app.component('DataTable', DataTable);
app.component('Column', Column);
app.component('ColumnGroup', ColumnGroup);
app.component('Row', Row);
app.directive('tooltip', Tooltip);
app.directive('ripple', Ripple);
app.directive('styleclass', StyleClass);

app.use(createPinia())
app.mount('#app')
