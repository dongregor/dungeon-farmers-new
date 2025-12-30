<script setup lang="ts">
// Demo page to showcase modal components
// Access at /modals-demo

const basicModalOpen = ref(false)
const customHeaderModalOpen = ref(false)
const noCloseModalOpen = ref(false)

// Confirmation dialogs
const infoDialogOpen = ref(false)
const warningDialogOpen = ref(false)
const dangerDialogOpen = ref(false)

// Size variants
const smallModalOpen = ref(false)
const mediumModalOpen = ref(false)
const largeModalOpen = ref(false)
const extraLargeModalOpen = ref(false)

// Demo action handlers
const handleInfoConfirm = () => {
  console.log('Info confirmed!')
}

const handleWarningConfirm = () => {
  console.log('Warning confirmed!')
}

const handleDangerConfirm = () => {
  console.log('Danger confirmed!')
}

const handleSaveAction = () => {
  console.log('Saved!')
  basicModalOpen.value = false
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-4xl font-bold text-gray-900 mb-2">
        Modal Components Demo
      </h1>
      <p class="text-gray-600 mb-8">
        Foundation modal components for Dungeon Farmers UI
      </p>

      <!-- BaseModal Examples -->
      <section class="mb-12">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">
          BaseModal
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Basic Modal -->
          <div class="bg-white rounded-lg p-6 shadow">
            <h3 class="font-semibold text-gray-800 mb-2">
              Basic Modal
            </h3>
            <p class="text-sm text-gray-600 mb-4">
              Standard modal with title, content, and footer
            </p>
            <button
              class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              @click="basicModalOpen = true"
            >
              Open Modal
            </button>
          </div>

          <!-- Custom Header -->
          <div class="bg-white rounded-lg p-6 shadow">
            <h3 class="font-semibold text-gray-800 mb-2">
              Custom Header
            </h3>
            <p class="text-sm text-gray-600 mb-4">
              Modal with custom header slot
            </p>
            <button
              class="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              @click="customHeaderModalOpen = true"
            >
              Open Modal
            </button>
          </div>

          <!-- No Close Button -->
          <div class="bg-white rounded-lg p-6 shadow">
            <h3 class="font-semibold text-gray-800 mb-2">
              Non-Closable
            </h3>
            <p class="text-sm text-gray-600 mb-4">
              Modal without close button (must use action)
            </p>
            <button
              class="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              @click="noCloseModalOpen = true"
            >
              Open Modal
            </button>
          </div>
        </div>

        <!-- Size Variants -->
        <div class="mt-6">
          <h3 class="font-semibold text-gray-800 mb-3">
            Size Variants
          </h3>
          <div class="flex flex-wrap gap-3">
            <button
              class="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              @click="smallModalOpen = true"
            >
              Small (sm)
            </button>
            <button
              class="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              @click="mediumModalOpen = true"
            >
              Medium (md)
            </button>
            <button
              class="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              @click="largeModalOpen = true"
            >
              Large (lg)
            </button>
            <button
              class="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              @click="extraLargeModalOpen = true"
            >
              Extra Large (xl)
            </button>
          </div>
        </div>
      </section>

      <!-- ConfirmationDialog Examples -->
      <section class="mb-12">
        <h2 class="text-2xl font-bold text-gray-800 mb-4">
          ConfirmationDialog
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Info Variant -->
          <div class="bg-white rounded-lg p-6 shadow">
            <h3 class="font-semibold text-gray-800 mb-2">
              Info Variant
            </h3>
            <p class="text-sm text-gray-600 mb-4">
              Blue styling for informational confirmations
            </p>
            <button
              class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors w-full"
              @click="infoDialogOpen = true"
            >
              Show Info
            </button>
          </div>

          <!-- Warning Variant -->
          <div class="bg-white rounded-lg p-6 shadow">
            <h3 class="font-semibold text-gray-800 mb-2">
              Warning Variant
            </h3>
            <p class="text-sm text-gray-600 mb-4">
              Yellow styling for cautionary actions
            </p>
            <button
              class="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors w-full"
              @click="warningDialogOpen = true"
            >
              Show Warning
            </button>
          </div>

          <!-- Danger Variant -->
          <div class="bg-white rounded-lg p-6 shadow">
            <h3 class="font-semibold text-gray-800 mb-2">
              Danger Variant
            </h3>
            <p class="text-sm text-gray-600 mb-4">
              Red styling for destructive actions
            </p>
            <button
              class="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors w-full"
              @click="dangerDialogOpen = true"
            >
              Show Danger
            </button>
          </div>
        </div>
      </section>

      <!-- Features List -->
      <section>
        <h2 class="text-2xl font-bold text-gray-800 mb-4">
          Features
        </h2>
        <div class="bg-white rounded-lg p-6 shadow">
          <ul class="space-y-2 text-gray-700">
            <li class="flex items-start">
              <span class="text-green-500 mr-2">✓</span>
              <span><strong>Focus Trap:</strong> Tab navigation stays within modal</span>
            </li>
            <li class="flex items-start">
              <span class="text-green-500 mr-2">✓</span>
              <span><strong>ESC to Close:</strong> Press ESC key to close modal</span>
            </li>
            <li class="flex items-start">
              <span class="text-green-500 mr-2">✓</span>
              <span><strong>Backdrop Click:</strong> Click outside to close (configurable)</span>
            </li>
            <li class="flex items-start">
              <span class="text-green-500 mr-2">✓</span>
              <span><strong>Scroll Lock:</strong> Body scrolling prevented when modal open</span>
            </li>
            <li class="flex items-start">
              <span class="text-green-500 mr-2">✓</span>
              <span><strong>Animations:</strong> Smooth fade + scale transitions</span>
            </li>
            <li class="flex items-start">
              <span class="text-green-500 mr-2">✓</span>
              <span><strong>Accessibility:</strong> Full ARIA attributes and keyboard navigation</span>
            </li>
            <li class="flex items-start">
              <span class="text-green-500 mr-2">✓</span>
              <span><strong>Teleport:</strong> Renders to body for proper z-index stacking</span>
            </li>
          </ul>
        </div>
      </section>
    </div>

    <!-- BaseModal Instances -->

    <!-- Basic Modal -->
    <BaseModal
      v-model="basicModalOpen"
      title="Basic Modal Example"
      size="md"
    >
      <p class="text-gray-700 mb-4">
        This is a basic modal with a title, content area, and footer with action buttons.
      </p>
      <p class="text-gray-600 text-sm">
        You can close this modal by clicking the X button, pressing ESC, clicking the backdrop, or using the action buttons.
      </p>

      <template #footer>
        <div class="flex gap-3">
          <button
            class="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors"
            @click="basicModalOpen = false"
          >
            Cancel
          </button>
          <button
            class="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            @click="handleSaveAction"
          >
            Save Changes
          </button>
        </div>
      </template>
    </BaseModal>

    <!-- Custom Header Modal -->
    <BaseModal
      v-model="customHeaderModalOpen"
      size="md"
    >
      <template #header>
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
            <span class="text-2xl">🎨</span>
          </div>
          <div>
            <h2 class="text-xl font-bold text-gray-800">
              Custom Header
            </h2>
            <p class="text-sm text-gray-600">
              With custom styling
            </p>
          </div>
        </div>
      </template>

      <p class="text-gray-700">
        This modal uses a custom header slot instead of the default title prop.
        You can put any content you want in the header!
      </p>

      <template #footer>
        <button
          class="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          @click="customHeaderModalOpen = false"
        >
          Close
        </button>
      </template>
    </BaseModal>

    <!-- Non-Closable Modal -->
    <BaseModal
      v-model="noCloseModalOpen"
      title="Important Action Required"
      size="md"
      :closable="false"
      :close-on-overlay="false"
    >
      <p class="text-gray-700 mb-4">
        This modal cannot be closed by clicking the X button, pressing ESC, or clicking the backdrop.
      </p>
      <p class="text-gray-600 text-sm">
        You must make a choice using one of the action buttons below.
      </p>

      <template #footer>
        <div class="flex gap-3">
          <button
            class="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors"
            @click="noCloseModalOpen = false"
          >
            Disagree
          </button>
          <button
            class="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            @click="noCloseModalOpen = false"
          >
            Agree
          </button>
        </div>
      </template>
    </BaseModal>

    <!-- Size Variants -->
    <BaseModal v-model="smallModalOpen" title="Small Modal" size="sm">
      <p class="text-gray-700">This is a small modal (max-w-sm).</p>
      <template #footer>
        <button
          class="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          @click="smallModalOpen = false"
        >
          Close
        </button>
      </template>
    </BaseModal>

    <BaseModal v-model="mediumModalOpen" title="Medium Modal" size="md">
      <p class="text-gray-700">This is a medium modal (max-w-md) - the default size.</p>
      <template #footer>
        <button
          class="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          @click="mediumModalOpen = false"
        >
          Close
        </button>
      </template>
    </BaseModal>

    <BaseModal v-model="largeModalOpen" title="Large Modal" size="lg">
      <p class="text-gray-700">This is a large modal (max-w-lg).</p>
      <template #footer>
        <button
          class="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          @click="largeModalOpen = false"
        >
          Close
        </button>
      </template>
    </BaseModal>

    <BaseModal v-model="extraLargeModalOpen" title="Extra Large Modal" size="xl">
      <p class="text-gray-700">This is an extra large modal (max-w-xl).</p>
      <template #footer>
        <button
          class="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          @click="extraLargeModalOpen = false"
        >
          Close
        </button>
      </template>
    </BaseModal>

    <!-- ConfirmationDialog Instances -->

    <!-- Info Variant -->
    <ConfirmationDialog
      v-model="infoDialogOpen"
      title="Information"
      message="This is an informational confirmation dialog. It uses blue styling for general information."
      confirm-text="Got It"
      cancel-text="Dismiss"
      variant="info"
      @confirm="handleInfoConfirm"
    />

    <!-- Warning Variant -->
    <ConfirmationDialog
      v-model="warningDialogOpen"
      title="Warning"
      message="This is a warning confirmation dialog. It uses yellow styling to indicate caution is needed."
      confirm-text="Proceed"
      cancel-text="Go Back"
      variant="warning"
      @confirm="handleWarningConfirm"
    />

    <!-- Danger Variant -->
    <ConfirmationDialog
      v-model="dangerDialogOpen"
      title="Danger"
      message="This is a danger confirmation dialog. It uses red styling for destructive actions that cannot be undone."
      confirm-text="Delete"
      cancel-text="Keep It"
      variant="danger"
      @confirm="handleDangerConfirm"
    />
  </div>
</template>
