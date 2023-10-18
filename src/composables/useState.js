import { ref } from 'vue';

function createModalState() {
    const isVisible = ref(false);
    const projectSetting = ref({});
    const project = ref({});
    const mode = ref('create');  // 默认是创建

    function openForEdit(data) {
        mode.value = 'edit';
        projectSetting.value = data.projectSetting;
        project.value = data.project;
        isVisible.value = true;
    }
    function openForCreate(projectId) {
        mode.value = 'create';
        projectSetting.value.projectId = projectId;
        isVisible.value = true;
    }

    function close() {
        isVisible.value = false;
        projectSetting.value = {};
        project.value = {};
    }

    return {
        isVisible,
        projectSetting,
        project,
        mode,
        openForEdit,
        openForCreate,
        close
    };
}

export const projectSettingsModalState = createModalState();

export const openProjectSettingsForCreate = projectSettingsModalState.openForCreate;
export const openProjectSettingsForEdit = projectSettingsModalState.openForEdit;
export const closeProjectSettings = projectSettingsModalState.close;
