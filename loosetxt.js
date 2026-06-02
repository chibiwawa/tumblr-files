function wrapLooseText() {
    document.querySelectorAll('#posts li.post.text div.content').forEach(container => {
        container.childNodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== "") {
                // If it's already wrapped, don't wrap it again
                if (node.parentNode.classList.contains('submission-guidelines')) return;

                const span = document.createElement('span');
                span.className = 'submission-guidelines';
                span.textContent = node.textContent.trim();
                
                node.parentNode.insertBefore(span, node);
                node.parentNode.removeChild(node);
            }
        });
    });
}

// Run immediately and listen for live updates
wrapLooseText();
new MutationObserver(wrapLooseText).observe(document.body, { childList: true, subtree: true });
