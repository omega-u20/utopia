export const toast ={
    warn: function(message){
        const toastEl=document.getElementById('toast');
        const toastBar=document.getElementById('toast-progress');
        toastEl.classList.add('show', 't-warn', 'bi-exclamation-triangle');
        toastEl.innerText=message;
        toastBar.style.animation='toast-progress 3s linear forwards';
        setTimeout(function(){
            toastEl.classList.remove('show', 't-warn', 'bi-exclamation-triangle');
            toastBar.style.animation='';
        },3000);
    },
    error: function(message){
        const toastEl=document.getElementById('toast');
        const toastBar=document.getElementById('toast-progress');
        toastEl.classList.add('show', 't-error', 'bi-x-circle');
        toastEl.innerText=message;
        toastBar.style.animation='toast-progress 3s linear forwards';
        setTimeout(function(){
            toastEl.classList.remove('show', 't-error', 'bi-x-circle');
            toastBar.style.animation='';
        },3000);
    },
    success: function(message){
        const toastEl=document.getElementById('toast');
        const toastBar=document.getElementById('toast-progress');
        toastEl.classList.add('show', 't-success', 'bi-check-circle');
        toastEl.innerText=message;
        toastBar.style.animation='toast-progress 3s linear forwards';
        setTimeout(function(){
            toastEl.classList.remove('show', 't-success', 'bi-check-circle');
            toastBar.style.animation='';
        },3000);
    }
}

export function AttachToast(){
    document.getElementsByTagName('body')[0].innerHTML+='<div id="toast" class="bi"><div id="toast-progress"></div></div>'
}