import * as MC from "@minecraft/server";
import * as UI from "@minecraft/server-ui";

const { world, system } = MC;

/**
 * 
 * @param { MC.Player } player 
 * @param { UI.ActionFormData | UI.ModalFormData | UI.MessageFormData } form 
 * @param { number } timeout_ms 
 * @returns { Promise<UI.ActionFormResponse | UI.ModalFormResponse | UI.MessageFormResponse> }
 */
export function forceShow(player, form, timeout_ms = 1000) {
    return new Promise((resolve, reject) => {
        const start = Date.now();
        
        const i = system.runInterval(async () => {
            if((Date.now() - start) > timeout_ms) {
                reject(new Error(`${player.name} にフォームを強制送信していましたが、タイムアウトしました。`));
                return;
            }

            const result = await form.show(player);
            
            if (result.cancelationReason && result.cancelationReason === UI.FormCancelationReason.UserBusy) {
                return;
            }
    
            system.clearRun(i);
            resolve(result);
        }, 10);
    });
}
