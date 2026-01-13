import { ref, type Component } from 'vue'

export interface ConfirmModalConfig {
    title?: string
    description?: string
    confirmLabel?: string
    cancelLabel?: string
    template?: Component
    onConfirm: () => void | Promise<void>
}

const isOpen = ref(false)
const modalConfig = ref<ConfirmModalConfig | null>(null)

class ConfirmModalBuilder {
    private config: Partial<ConfirmModalConfig> = {}

    title(title: string): this {
        this.config.title = title
        return this
    }

    description(description: string): this {
        this.config.description = description
        return this
    }

    confirmLabel(label: string): this {
        this.config.confirmLabel = label
        return this
    }

    cancelLabel(label: string): this {
        this.config.cancelLabel = label
        return this
    }

    template(component: Component): this {
        this.config.template = component
        return this
    }

    onConfirm(callback: () => void | Promise<void>): this {
        this.config.onConfirm = callback
        return this
    }

    open(): void {
        if (!this.config.onConfirm) {
            throw new Error('onConfirm callback is required')
        }
        modalConfig.value = {
            confirmLabel: 'Confirmer',
            cancelLabel: 'Annuler',
            ...this.config
        } as ConfirmModalConfig
        isOpen.value = true
    }
}

export function useConfirmModal(): ConfirmModalBuilder {
    return new ConfirmModalBuilder()
}

export function useConfirmModalState() {
    const closeModal = () => {
        isOpen.value = false
        // Reset config after a short delay to allow transition
        setTimeout(() => {
            modalConfig.value = null
        }, 300)
    }

    const handleConfirm = async () => {
        if (modalConfig.value?.onConfirm) {
            await modalConfig.value.onConfirm()
            closeModal()
        }
    }

    return {
        isOpen,
        modalConfig,
        closeModal,
        handleConfirm
    }
}
