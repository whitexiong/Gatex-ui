import { ref } from 'vue';

function createModalState() {
    const isVisible = ref(false);
    const state = ref({});  // 包含所有的数据状态
    const mode = ref('create');  // 默认是创建

    function openWithDetails(details) {
        mode.value = details.mode || 'create';
        Object.assign(state.value, details.state);
        isVisible.value = true;
    }

    function openWithPartialState(partialState) {
        mode.value = 'create';
        Object.assign(state.value, partialState);
        isVisible.value = true;
    }

    function close() {
        isVisible.value = false;
        for (let key in state.value) {
            state.value[key] = undefined;
        }
    }

    return {
        isVisible,
        state,
        mode,
        openWithDetails,
        openWithPartialState,
        close
    };
}

// 为每个模态窗口创建独立的状态
export const projectSettingsModalState = createModalState();
export const userProfileModalState = createModalState();
