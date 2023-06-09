import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Animated,
    TouchableNativeFeedback,
    TouchableOpacity,
    ViewProps,
    ViewStyle,
    TextStyle,
    Dimensions,
} from 'react-native';
import Text from '../../BaseText'

const SCALE_NUMBER = 2;

export default class DefaultTabBar extends Component {
    static defaultProps = {
        paddingInset: 0,
        activeTextStyle: { color: '#FFFFFF' },
        inactiveTextStyle: { color: '#ffffff' },
        hiddenUnderLine: false,
    };

    _renderTab(name, page, isTabActive, onPressHandler) {
        const { tabWidth, tabStyle, textStyle, activeTextStyle, inactiveTextStyle } = this.props;
        const tabTextStyle = isTabActive ? activeTextStyle : inactiveTextStyle;
        const tabWidthStyle = tabWidth ? { width: tabWidth } : { flex: 1 };
        const tabItem = {
            alignItems: 'center',
            justifyContent: 'center',
            ...tabWidthStyle,
            ...tabStyle,
        };
        const tabText = {
            fontSize: 16,
            ...textStyle,
            ...tabTextStyle,
        };
        return (
            <TouchableOpacity style={tabItem} key={name} onPress={() => onPressHandler(page)}>
                <Text style={tabText}>{name}</Text>
            </TouchableOpacity>
        );
    }

    _renderUnderline() {
        const {
            scrollValue,
            containerWidth,
            paddingInset,
            tabs,
            tabWidth,
            tabUnderlineWidth,
            underlineStyle,
        } = this.props;
        const numberOfTabs = tabs.length;
        const calcTabWidth = tabWidth || (containerWidth - paddingInset) / numberOfTabs;
        const calcUnderlineWidth = Math.min(tabUnderlineWidth || calcTabWidth * 0.6, calcTabWidth);
        const underlineLeft = (calcTabWidth - calcUnderlineWidth) / 2 + paddingInset;
        const tabUnderlineStyle = {
            position: 'absolute',
            width: calcUnderlineWidth,
            height: 3,
            borderRadius: 3,
            backgroundColor: '#422DDD',  
            bottom: 1,
            left: underlineLeft,
            ...underlineStyle,
        };

        // 计算underline动画系数
        const scaleValue = () => {
            const arr = new Array(numberOfTabs * 2);
            return arr.fill(0).reduce(
                function (pre, cur, idx) {
                    idx == 0 ? pre.inputRange.push(cur) : pre.inputRange.push(pre.inputRange[idx - 1] + 0.5);
                    idx % 2 ? pre.outputRange.push(SCALE_NUMBER) : pre.outputRange.push(1);
                    return pre;
                },
                { inputRange: [], outputRange: [] },
            );
        };
        const scaleX = scrollValue.interpolate(scaleValue());
        const translateX = scrollValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, calcTabWidth],
        });

        return (
            <Animated.View
                style={[
                    tabUnderlineStyle,
                    {
                        transform: [{ translateX }, { scaleX }],
                    },
                ]}
            />
        );
    }

    componentDidMount() {
        this.props.onMounted && this.props.onMounted();
    }

    render() {
        const { tabBarStyle, paddingInset, hiddenUnderLine, tabs } = this.props;
        return (
            <Animated.View style={[styles.tabBar, { paddingHorizontal: paddingInset }, tabBarStyle]}>
                {!hiddenUnderLine && this._renderUnderline()}
                {tabs.map((name, page) => {
                    const isTabActive = this.props.activeTab === page;
                    return this._renderTab(name, page, isTabActive, this.props.goToPage);
                })}
            </Animated.View>
        );
    }
}

const shadowSetting = {
    width: Dimensions.get('window').width,
    height: 50,
    color: '#E8E8E8',
    border: 5,
    radius: 15,
    opacity: 0.5,
    x: 0,
    y: 0,
};
const styles = StyleSheet.create({
    tabBar: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'stretch',
        // borderBottomWidth: StyleSheet.hairlineWidth,
        // borderColor: '#f0f0f0',
    },
});
