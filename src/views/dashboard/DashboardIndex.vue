<template>
  <div class="min-h-screen flex relative lg:static bg-surface-50 dark:bg-surface-950">
    <div
      id="app-sidebar-6"
      class="h-screen hidden lg:block flex-shrink-0 absolute lg:static left-0 top-0 z-10 select-none w-48 bg-primary animate-duration-300 animate-ease-in-out"
    >
      <div class="flex flex-col h-full">
        <div class="flex items-center justify-center flex-shrink-0 h-[60px]">
          <svg height="36" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M42.6792 7.32384C39.183 3.82714 34.7285 1.44571 29.8788 0.480712C25.0292 -0.484288 20.0023 0.0105324 15.4339 1.90259C10.8655 3.79464 6.9608 6.99901 4.21357 11.1103C1.46634 15.2216 0 20.0553 0 25C0 29.9447 1.46634 34.7784 4.21357 38.8897C6.9608 43.001 10.8655 46.2054 15.4339 48.0974C20.0023 49.9895 25.0292 50.4843 29.8788 49.5193C34.7285 48.5543 39.183 46.1729 42.6792 42.6762C47.3667 37.9879 50 31.6296 50 25C50 18.3704 47.3667 12.0121 42.6792 7.32384ZM6.52009 16.5397C7.77982 13.7456 9.64643 11.2673 11.9843 9.28518C14.3221 7.30303 17.0722 5.86678 20.0347 5.08098C22.9973 4.29517 26.0978 4.17955 29.1106 4.7425C32.1235 5.30544 34.9729 6.53277 37.452 8.33527C31.3155 7.75571 23.6337 10.8921 17.4065 17.1079C15.0562 19.4544 13.0651 22.1348 11.4974 25.0625C9.36518 22.5257 7.68188 19.6433 6.52009 16.5397ZM20.3042 45.5397C15.5592 44.2684 11.4229 41.347 8.6383 37.3001C5.85366 33.2533 4.60304 28.3462 5.11107 23.4602C7.69054 29.0625 14.202 34.1534 22.7474 36.4262C25.9376 37.2915 29.2393 37.6745 32.5429 37.5625C31.4201 40.6682 29.7795 43.5614 27.6905 46.1193C25.2123 46.37 22.7091 46.1659 20.3042 45.517V45.5397ZM35.8611 21.7784C35.0187 18.5738 33.7092 15.5107 31.9746 12.6875C35.2238 12.1091 38.5474 12.0861 41.8042 12.6193C43.262 14.6374 44.3366 16.9062 44.9746 19.3125C46.2481 24.0582 45.7875 29.1025 43.6754 33.539C41.5634 37.9755 37.9385 41.5134 33.452 43.5171C36.9974 38.5057 38.1337 30.2897 35.8611 21.7784Z"
              class="fill-primary-contrast"
            />
          </svg>
        </div>
        <div class="my-4 p-4">
          <IconField icon-position="left">
            <InputIcon class="pi pi-search !text-primary-contrast/80" />
            <InputText
              type="text"
              class="!border-0 !bg-primary-200/30 !text-primary-contrast placeholder:!text-primary-contrast/80 w-full"
              placeholder="Search"
            />
          </IconField>
        </div>
        <div class="overflow-y-auto">
          <ul class="list-none p-4 m-0 flex flex-wrap">
            <li class="w-6/12 text-center">
              <a
                class="w-[60px] h-[60px] rounded-xl cursor-pointer inline-flex items-center justify-center border-2 border-primary-200/30 hover:bg-primary-emphasis text-primary-contrast transition-colors duration-150"
              >
                <i class="pi pi-home text-2xl" />
              </a>
              <div class="mt-2 text-primary-contrast/70 font-medium text-sm">Home</div>
            </li>
            <li class="w-6/12 text-center">
              <a
                class="w-[60px] h-[60px] rounded-xl cursor-pointer inline-flex items-center justify-center border-2 border-primary-200/30 hover:bg-primary-emphasis text-primary-contrast transition-colors duration-150"
              >
                <i class="pi pi-star-fill text-2xl" />
              </a>
              <div class="mt-2 text-primary-contrast/70 font-medium text-sm">Favorites</div>
            </li>
            <li class="w-6/12 text-center mt-4">
              <a
                class="w-[60px] h-[60px] rounded-xl cursor-pointer inline-flex items-center justify-center border-2 border-primary-200/30 hover:bg-primary-emphasis text-primary-contrast transition-colors duration-150"
              >
                <i class="pi pi-users text-2xl" />
              </a>
              <div class="mt-2 text-primary-contrast/70 font-medium text-sm">Users</div>
            </li>
            <li class="w-6/12 text-center mt-4">
              <a
                class="w-[60px] h-[60px] rounded-xl cursor-pointer inline-flex items-center justify-center border-2 border-primary-200/30 hover:bg-primary-emphasis text-primary-contrast transition-colors duration-150"
              >
                <i class="pi pi-comments text-2xl" />
              </a>
              <div class="mt-2 text-primary-contrast/70 font-medium text-sm">Chart</div>
            </li>
            <li class="w-6/12 text-center mt-4">
              <a
                class="w-[60px] h-[60px] rounded-xl cursor-pointer inline-flex items-center justify-center border-2 border-primary-200/30 hover:bg-primary-emphasis text-primary-contrast transition-colors duration-150"
              >
                <i class="pi pi-calendar text-2xl" />
              </a>
              <div class="mt-2 text-primary-contrast/70 font-medium text-sm">Calendar</div>
            </li>
            <li class="w-6/12 text-center mt-4">
              <a
                class="w-[60px] h-[60px] rounded-xl cursor-pointer inline-flex items-center justify-center border-2 border-primary-200/30 hover:bg-primary-emphasis text-primary-contrast transition-colors duration-150"
              >
                <i class="pi pi-cog text-2xl" />
              </a>
              <div class="mt-2 text-primary-contrast/70 font-medium text-sm">Settings</div>
            </li>
          </ul>
        </div>
        <div class="mt-auto border-t border-primary-200/30 p-4 flex justify-between">
          <a
            class="w-10 h-10 rounded-xl cursor-pointer inline-flex items-center justify-center border-2 border-primary-200/30 hover:bg-primary-emphasis text-primary-contrast transition-colors duration-150"
          >
            <img
              src="https://fqjltiegiezfetthbags.supabase.co/storage/v1/render/image/public/block.images/blocks/avatars/circle/avatar-f-6.png"
              class="w-6 h-6"
            />
          </a>
          <a
            class="w-10 h-10 rounded-xl cursor-pointer inline-flex items-center justify-center border-2 border-primary-200/30 hover:bg-primary-emphasis text-primary-contrast transition-colors duration-150"
          >
            <i class="pi pi-slack text-xl" />
          </a>
          <a
            class="w-10 h-10 rounded-xl cursor-pointer inline-flex items-center justify-center border-2 border-primary-200/30 hover:bg-primary-emphasis text-primary-contrast transition-colors duration-150"
          >
            <i class="pi pi-github text-xl" />
          </a>
        </div>
      </div>
    </div>
    <div class="min-h-screen flex flex-col relative flex-auto">
      <div
        class="h-[60px] flex justify-between items-center px-8 bg-surface-0 dark:bg-surface-950 shadow relative lg:static border-b border-surface"
      >
        <div class="flex">
          <a
            v-styleclass="{
              selector: '#app-sidebar-6',
              enterFromClass: 'hidden',
              enterActiveClass: 'animate-fadeinleft',
              leaveToClass: 'hidden',
              leaveActiveClass: 'animate-fadeoutleft',
              hideOnOutsideClick: true,
            }"
            class="cursor-pointer block lg:hidden text-surface-700 dark:text-surface-100 mr-4 mt-1"
          >
            <i class="pi pi-bars text-4xl" />
          </a>
        </div>
        <a
          v-styleclass="{
            selector: '@next',
            enterFromClass: 'hidden',
            enterActiveClass: 'animate-fadein',
            leaveToClass: 'hidden',
            leaveActiveClass: 'animate-fadeout',
            hideOnOutsideClick: true,
          }"
          class="cursor-pointer block lg:hidden text-surface-700 dark:text-surface-100"
        >
          <i class="pi pi-ellipsis-v text-2xl" />
        </a>
        <ul
          class="list-none p-0 m-0 hidden lg:flex lg:items-center select-none lg:flex-row bg-surface-0 dark:bg-surface-950 border lg:border-0 border-surface right-0 top-full z-10 shadow lg:shadow-none absolute lg:static"
        >
          <li>
            <a
              class="flex p-4 lg:px-4 lg:py-2 items-center text-surface-600 dark:text-surface-200 hover:text-surface-900 dark:hover:text-surface-0 hover:bg-surface-100 dark:hover:bg-surface-700 font-medium rounded-border cursor-pointer duration-150 transition-colors"
            >
              <i class="pi pi-inbox text-base lg:!text-2xl leading-none mr-2 lg:mr-0" />
              <span class="block lg:hidden font-medium">Inbox</span>
            </a>
          </li>
          <li>
            <a
              class="flex p-4 lg:px-4 lg:py-2 items-center text-surface-600 dark:text-surface-200 hover:text-surface-900 dark:hover:text-surface-0 hover:bg-surface-100 dark:hover:bg-surface-700 font-medium rounded-border cursor-pointer duration-150 transition-colors"
            >
              <OverlayBadge severity="danger" class="mr-2 lg:mr-0">
                <i class="pi pi-bell text-base lg:!text-2xl leading-none" />
              </OverlayBadge>
              <span class="block lg:hidden font-medium">Notifications</span>
            </a>
          </li>
          <li class="border-t border-surface lg:border-t-0">
            <a
              class="flex p-4 lg:px-4 lg:py-2 items-center hover:bg-surface-100 dark:hover:bg-surface-700 font-medium rounded-border cursor-pointer duration-150 transition-colors"
            >
              <img
                src="https://fqjltiegiezfetthbags.supabase.co/storage/v1/render/image/public/block.images/blocks/avatars/circle/avatar-f-6.png"
                class="mr-4 lg:mr-0 w-8 h-8"
              />
              <div class="block lg:hidden">
                <div class="text-surface-900 dark:text-surface-0 font-medium">
                  Josephine Lillard
                </div>
                <span class="text-surface-600 dark:text-surface-200 font-medium text-sm"
                  >Marketing Specialist</span
                >
              </div>
            </a>
          </li>
        </ul>
      </div>
      <div class="p-8 flex flex-col flex-auto">
        <div
          class="border-2 border-dashed border-surface rounded-border bg-surface-0 dark:bg-surface-950 flex-auto"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import InputText from "primevue/inputtext";
import OverlayBadge from "primevue/overlaybadge";
</script>
