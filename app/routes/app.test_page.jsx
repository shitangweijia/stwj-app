import { useState } from 'react';

export default function TestPage() {
    const [visible, setVisible] = useState(true);

    return (
        <s-page heading="组件测试页">
            <s-section heading="测试点击按钮打开横幅">
                {
                    visible && (
                        // hidden={!visible} 淡入淡出
                        // onDismiss={() => setVisible(false)} 关闭横幅
                        <s-banner heading="通知" tone="success" dismissible
                            hidden={!visible}>
                            这是一个横幅
                        </s-banner>
                    )
                }

                <s-button onClick={() => setVisible(v => !v)}>
                    {visible ? '关闭横幅' : '打开横幅'}
                </s-button>

            </s-section>
            
            <s-section heading="建立可以拖动的表单构建器">
                

            </s-section>
        </s-page>
    )

}